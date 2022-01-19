# Builder image
FROM registry.access.redhat.com/ubi8/nodejs-14 as builder
COPY build build
COPY entrypoint.sh .
COPY server .
RUN npm install

# Runner image
FROM registry.access.redhat.com/ubi8/nodejs-14-minimal

# Add tar package to allow copying files with kubectl scp
# Add ps package to allow liveness probe for k8s cluster
USER root
RUN microdnf -y install tar procps-ng && microdnf clean all
USER 1001

LABEL name="konveyor/tackle-ui" \
      description="Konveyor for Tackle - User Interface" \
      help="For more information visit https://konveyor.io" \
      license="Apache License 2.0" \
      maintainer="cferiavi@redhat.com,mrizzi@redhat.com,gdubreui@redhat.com" \
      summary="Konveyor for Tackle - User Interface" \
      url="https://quay.io/gildub/tackle-ui" \
      usage="podman run -p 80 -v konveyor/tackle-ui:latest" \
      com.redhat.component="konveyor-tackle-ui-container" \
      io.k8s.display-name="tackle-ui" \
      io.k8s.description="Konveyor for Tackle - User Interface" \
      io.openshift.expose-services="80:http" \
      io.openshift.tags="operator,konveyor,ui,nodejs14" \
      io.openshift.min-cpu="100m" \
      io.openshift.min-memory="350Mi"

COPY --from=builder /opt/app-root/src /opt/app-root/src
COPY --from=builder /opt/app-root/src/entrypoint.sh /usr/bin/entrypoint.sh

ENV DEBUG=1

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
