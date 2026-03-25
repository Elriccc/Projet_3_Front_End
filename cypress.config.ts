import { execSync } from 'child_process'
import { defineConfig } from 'cypress'
import * as path from 'path'

async function waitForContainerHealthy(containerName: string, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = execSync(
        `docker inspect --format='{{.State.Health.Status}}' ${containerName}`
      ).toString().trim()
      if (result === 'healthy') {
        return
      }
    } catch (err) {}
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  throw new Error(`${containerName} not healthy after ${retries} retries`)
}

const BACK_END_PATH = '../Projet_3_Back_End/'
const COMPOSE_FILE = path.resolve(__dirname, `${BACK_END_PATH}compose.yaml`)
const COMPOSE = `docker compose -f ${COMPOSE_FILE}`
const BASE_URL = "http://localhost:4200"

export default defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    taskTimeout: 120000,
    setupNodeEvents(on, config){
      on('task', {
        async startE2EDatabase() {
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env --env-file ${BACK_END_PATH}.env.e2e --profile e2e up -d db_e2e`, { stdio: 'inherit' });
          await waitForContainerHealthy('datashare_db_e2e');
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env --env-file ${BACK_END_PATH}.env.e2e --profile e2e up -d --no-deps --force-recreate backend`, { stdio: 'inherit' });
          await waitForContainerHealthy('datashare_backend');
          return null;
        },
        stopE2EDatabase() {
          execSync(`${COMPOSE} --env-file ${BACK_END_PATH}.env --env-file ${BACK_END_PATH}.env.e2e --profile e2e stop backend db_e2e`, { stdio: 'inherit' });
          execSync(`${COMPOSE} up backend`, { stdio: 'inherit' })
          return null;
        }
      })
    },
  },
})