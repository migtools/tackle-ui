import Keycloak from "keycloak-js";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");

export default keycloak;
