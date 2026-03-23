# Deploy on Scaleway Serverless Containers

This guide walks you through deploying Team Bookmarks on [Scaleway Serverless Containers](https://www.scaleway.com/en/serverless-containers/). The app is a stateless Docker image — no database, no persistent storage — which makes serverless containers a perfect fit.

## Prerequisites

- A [Scaleway account](https://console.scaleway.com)
- [Docker](https://docs.docker.com/get-docker/) installed locally
- [Scaleway CLI](https://github.com/scaleway/scaleway-cli) installed and configured

```bash
# Install the Scaleway CLI (macOS)
brew install scaleway/tap/scw

# Configure credentials
scw init
```

## 1. Build the Docker image

```bash
git clone https://github.com/slashgear/team-bookmarks.git
cd team-bookmarks
docker build -t team-bookmarks .
```

## 2. Create a Container Registry namespace

```bash
scw registry namespace create name=team-bookmarks region=fr-par
```

Note the namespace ID and name in the output.

## 3. Push the image to Scaleway Registry

```bash
# Log in to the registry
docker login rg.fr-par.scw.cloud -u nologin -p $(scw config get secret-key)

# Tag the image
docker tag team-bookmarks rg.fr-par.scw.cloud/<your-namespace>/team-bookmarks:latest

# Push
docker push rg.fr-par.scw.cloud/<your-namespace>/team-bookmarks:latest
```

## 4. Deploy the container

### Via the Scaleway Console

1. Go to **Serverless → Containers** in the [Scaleway Console](https://console.scaleway.com)
2. Create a new namespace (or reuse one)
3. Click **Deploy a container**
4. Select your image: `rg.fr-par.scw.cloud/<your-namespace>/team-bookmarks:latest`
5. Set port to **3000**
6. Choose resources: **256 MB RAM, 140 mCPU** is enough
7. Set min scale to **0** (scales to zero when idle) or **1** (always warm)
8. Click **Deploy**

Scaleway provides a public HTTPS URL automatically. No extra configuration needed.

### Via the CLI

First, create a Serverless Containers namespace:

```bash
scw container namespace create name=team-bookmarks region=fr-par
```

Then deploy:

```bash
scw container container create \
  name=team-bookmarks \
  namespace-id=<namespace-id> \
  registry-image=rg.fr-par.scw.cloud/<your-namespace>/team-bookmarks:latest \
  port=3000 \
  min-scale=0 \
  max-scale=5 \
  memory-limit=256 \
  cpu-limit=140 \
  region=fr-par
```

Deploy the created container:

```bash
scw container container deploy <container-id> region=fr-par
```

## 5. Get your URL

```bash
scw container container get <container-id> region=fr-par
```

Look for the `domain-name` field. Your app is live at `https://<domain-name>`.

## Automatic deployments with GitHub Actions

Add these secrets to your GitHub repository (**Settings → Secrets → Actions**):

| Secret                   | Value                                     |
| ------------------------ | ----------------------------------------- |
| `SCW_ACCESS_KEY`         | Your Scaleway access key                  |
| `SCW_SECRET_KEY`         | Your Scaleway secret key                  |
| `SCW_REGISTRY_NAMESPACE` | e.g. `rg.fr-par.scw.cloud/team-bookmarks` |
| `SCW_CONTAINER_ID`       | The container ID from step 4              |

Then add this job to your release workflow:

```yaml
- name: Log in to Scaleway Registry
  uses: docker/login-action@v3
  with:
    registry: rg.fr-par.scw.cloud
    username: nologin
    password: ${{ secrets.SCW_SECRET_KEY }}

- name: Build and push to Scaleway Registry
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: ${{ secrets.SCW_REGISTRY_NAMESPACE }}/team-bookmarks:latest

- name: Deploy on Scaleway
  uses: scaleway/serverless-scaleway-action@v0
  with:
    scw_access_key: ${{ secrets.SCW_ACCESS_KEY }}
    scw_secret_key: ${{ secrets.SCW_SECRET_KEY }}
    scw_containers_ids: ${{ secrets.SCW_CONTAINER_ID }}
    scw_region: fr-par
```

## Notes

- The `PORT` environment variable is automatically injected by Scaleway — the app reads it natively.
- HTTPS is provided automatically, which means the `Strict-Transport-Security` header is fully effective.
- With `min-scale=0`, cold starts are ~1–2 seconds. Set `min-scale=1` if you want instant response times.
