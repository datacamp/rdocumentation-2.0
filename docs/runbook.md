# CMS - Runbook

[:arrow_backward:](../README.md)

## Overview

- **Service Name**: `rdocumentation`
- **Service Description**: Rdocumentation or Rdocs is an application that exists out of multiple components. Everything relevant to the runbook for these components will be included in here to avoid confusion.
Rdocumentation is served from a different domain namely rdocumentation.org. It is considered a separate entity to DataCamp, and it is semi open-source. That's why some components are found in the [DataCamp Github org](https://github.com/datacamp), and some are found in the [DataCamp/Engineering Github org](https://github.com/datacamp-engineering). The infrastructure related components will always be found in datacamp-engineering as this contains restricted information.
The application serves Documentation for the programming language R.

- **Owner Team**: [Conversion Engineering](https://datacamp.slack.com/archives/C02TT562CPN)
- **Deployment Locations**: Kubernetes `app-cluster`, under the `r-documentation` namespace.
- **See current deployment state**:

```bash
> kubectl -n r-documentation get pods                                                        kube app-cluster
NAME                                         READY   STATUS    RESTARTS   AGE
// ...
rdoc-app-1161-5d5596d876-sfxsv                    2/2     Running   0          41h
rdoc-app-worker-1161-5d5596d876-sfxsv             2/2     Running   0          41h
rdoc-app-sqs-1161-5d5596d876-sfxsv                2/2     Running   0          41h
rdocumentation-1161-5d5596d876-vkkjc              2/2     Running   0          15h
// ...
```

## Components

As previously stated, rdocs has multiple components. Full architecture explanation can be found [here](https://datacamp.atlassian.net/wiki/spaces/PRODENG/pages/2314469377/RDocumentation).

1. [Rdocumentation which is the user interface for Rdocs](https://github.com/datacamp-engineering/rdocumentation-v2)
2. [Rdoc-app which is the API for Rdocs](https://github.com/datacamp/rdocumentation-app)
3. Rdoc-app-worker (Lambda)
4. [Rdoc-r-package-parser](https://github.com/datacamp/r-package-parser)
5. [Rdoc elastic search for searching](https://github.com/datacamp/RDocumentation-elasticsearch)
6. Multiple SQS queues
7. a Redis and a SQL db

## Service Health and Monitoring

### Dashboards

- [Rdoc App Worker](https://app.datadoghq.com/dashboard/jnj-4hi-8u4/rdoc-app-worker-eks-monitoring-dashboard-managed-via-terraform?fromUser=false&refresh_mode=sliding&from_ts=1753713201974&to_ts=1753716801974&live=true)
- [Rdoc App SQSd EKS](https://app.datadoghq.com/dashboard/69m-d9h-swt/rdoc-app-sqsd-eks-monitoring-dashboard-managed-via-terraform?fromUser=false&refresh_mode=sliding&from_ts=1753713202356&to_ts=1753716802356&live=true)
- [Rdoc App API EKS](https://app.datadoghq.com/dashboard/gwg-xh2-vkd/rdoc-app-eks-monitoring-dashboard-managed-via-terraform?fromUser=false&refresh_mode=sliding&from_ts=1753713201634&to_ts=1753716801634&live=true)
- [Rdocumentation UI EKS](https://app.datadoghq.com/dashboard/jxj-uiv-44d/rdocumentation-eks-monitoring-dashboard-managed-via-terraform?fromUser=false&refresh_mode=sliding&from_ts=1753630401360&to_ts=1753716801360&live=true)

### Logs

- [Rdoc app worker](https://app.datadoghq.com/logs?query=service%3Ardoc-app-worker)
- [Rdoc App SQSd](https://app.datadoghq.com/logs?query=service%3Ardoc-app-worker)
- [Rdoc App API](https://app.datadoghq.com/logs?query=service%3Ardoc-app)
- [Rdocumentation UI](https://app.datadoghq.com/logs?query=service%3Ardocumentation)

## ⚠️ Common Issues & Resolutions

### 1. Data source unavailability from abandoned Depsy service

**Symptoms**:

- Users report missing data that they expect to be present
- 404 errors occasionally slip through despite safeguards
- API calls to external data sources timing out or failing

**Likely Causes**:

- One of our data sources (Depsy) shut down in 2018 (tweet: @<https://x.com/depsy_org/status/970376969782149120>) and is an abandoned project at this point. We never backed this information up, as the API often goes down when we try to sink all the data that is available in there. This causes some data to be unavailable that users do expect to be present. We have safeguards in place to prevent 404s from happening too often, but some can slip through the cracks.

**Troubleshooting Steps**:

1. Check if the missing data or 404 error is related to content that would have come from the Depsy data source
2. Verify that the external API service is temporarily down by checking its status
3. Wait for a few minutes for the service to come up again, as it may be experiencing temporary downtime
4. Monitor error rates to ensure the issue resolves itself once the external service is available
5. If the issue persists, escalate to determine if alternative data sources or manual data entry is needed

### 2. Missing Host and X-Forwarded-Host headers causing redirect issues

**Symptoms**:

- 302 redirects happening unexpectedly
- Rdocs search functionality failing to work properly
- Request routing issues between services

**Likely Causes**:

- The Rdoc App Worker relies on the Host and X-Forwarded-Host headers to be present in the request. Requests going from Kong to Istio, and then to the service, have to make sure that this data is present, otherwise 302 redirects will happen and the search of Rdocs will fail to work.

**Troubleshooting Steps**:

1. Check the request headers in the failing requests to verify if Host and X-Forwarded-Host are present
2. Trace the request path from Kong through Istio to the service to identify where headers are being dropped
3. Verify Kong and Istio configurations to ensure proper header forwarding
4. Contact infrastructure team to implement fixes that ensure these headers get forwarded correctly through the entire request chain
5. Test the fix by verifying that Rdocs search functionality works as expected after the infrastructure change

### 3. Legacy codebase with outdated dependencies

**Symptoms**:

- Difficulty updating packages or dependencies
- Security vulnerabilities in old packages
- Package functionality differs significantly from documentation
- Build or runtime issues when trying to make changes

**Likely Causes**:

- The API and the other components except for the UI were created in 2015-2016 and have never been properly updated. This means that dependencies are old and we run Node 8 on this app. This results in potential security issues or issues to update packages. This makes it so that when change is painful as some packages use completely different structures/functionality than their more recent versions.

**Troubleshooting Steps**:

1. Check the package.json file to identify the specific versions of dependencies being used
2. When working with packages, make sure to reference documentation that matches the exact version used in the codebase
3. Before making changes, research the specific version's API and functionality rather than assuming current documentation applies
4. If package updates are absolutely necessary, plan for significant refactoring work due to breaking changes between versions
5. Consider creating a migration plan to gradually update the Node.js version and dependencies if long-term maintenance is required

### 4. backend service dependency failures

**Symptoms**:

- Search functionality completely broken
- Package pages returning 404 or failing to load
- Autocomplete not working in search bars
- General application functionality degraded

**Likely Causes**:

- The frontend application heavily depends on `api.rdocumentation.org` for all core functionality including search, package data, topic information, and collaborator data. The API backend includes multiple components (rdoc-app, elasticsearch, worker services, databases) and if any of these fail, it can cause widespread issues. The frontend has minimal error handling and no fallback mechanisms when the API is unavailable.

**Troubleshooting Steps**:

1. Check the health of `api.rdocumentation.org` by testing basic endpoints (/search_packages)
2. Verify the status of all backend components: rdoc-app, elasticsearch, worker services, Redis,...
3. Check the EKS monitoring dashboards for the rdoc-app API, worker, and SQS services
4. Monitor for any ongoing deployments or infrastructure changes that might affect the API
5. Review Datadog logs for API error patterns, database connection issues, or elasticsearch failures
6. If specific components are down, coordinate with infrastructure team to restore services
7. Check SQS queue health and processing as backup data processing may be affected
