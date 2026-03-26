import { execSync } from 'child_process'
import { defineConfig } from 'cypress'
import * as path from 'path'

async function waitForContainerHealthy(containerName: string, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = execSync(
        `docker inspect --format='{{.State.Health.Status}}' ${containerName}`
      ).toString().trim()
      console.log(containerName + " statut: " + result)
      if (result === 'healthy') {
        return
      }
    } catch (err) {}
    await new Promise(r => setTimeout(r, delay))
  }
  throw new Error(`${containerName} not healthy after ${retries} retries`)
}

async function waitForApiReady(url: string, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      console.log("Status:", res.status)
      if (res.status === 200) return
    } catch {}
    await new Promise(r => setTimeout(r, delay))
  }
  throw new Error(`API not ready`)
}

const BACK_END_PATH = '../Projet_3_Back_End/'
const COMPOSE_FILE = path.resolve(__dirname, `${BACK_END_PATH}compose.yaml`)
const COMPOSE = `docker compose -f ${COMPOSE_FILE}`
const BASE_URL = "http://localhost:4200"

export default defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    chromeWebSecurity: false,
    taskTimeout: 120000,
    setupNodeEvents(on, config){
      on('task', {
        async startE2EDatabase() {
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env --env-file ${BACK_END_PATH}.env.e2e --profile e2e up -d db_e2e`, { stdio: 'inherit' });
          await waitForContainerHealthy('datashare_db_e2e');
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env --env-file ${BACK_END_PATH}.env.e2e --profile e2e up -d --no-deps --force-recreate backend`, { stdio: 'inherit' });
          await waitForContainerHealthy('datashare_backend');
          await waitForApiReady('http://localhost:8081/actuator/health')
          return null;
        },
        async stopE2EDatabase() {
          execSync(`${COMPOSE} down backend db_e2e`, { stdio: 'inherit' });
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env up -d --no-deps --force-recreate backend`, { stdio: 'inherit' })
          await waitForContainerHealthy('datashare_backend');
          await waitForApiReady('http://localhost:8081/actuator/health')
          return null;
        }
      })
    },
  },
})