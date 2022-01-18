# Runner image
FROM registry.access.redhat.com/ubi8/nginx-118
USER 1001

LABEL name="konveyor/tackle-ui" \
      description="Konveyor for Tackle - User Interface" \
      help="For more information visit https://konveyor.io" \
      license="Apache License 2.0" \
      maintainer="gdubreui@redhat.com" \
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

COPY build .
COPY nginx.conf.template .
COPY entrypoint.sh /usr/bin/entrypoint.sh

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
