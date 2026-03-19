import { execSync } from 'child_process'
import { defineConfig } from 'cypress'
import * as path from 'path'

const COMPOSE_FILE = path.resolve(__dirname, "../Projet_3_Back_End/compose.yaml")
const COMPOSE = `docker compose -f ${COMPOSE_FILE}`
const BASE_URL = "http://localhost:4200"

export default defineConfig({
  e2e: {
    'baseUrl': BASE_URL
  },
  setupNodeEvents(on, config){
    on('task', {
      startE2EDatabase() {
        execSync(`${COMPOSE} --env-file .env --env-file .env.e2e --profile e2e up -d db_e2e --wait`)
        execSync(`${COMPOSE} --env-file .env --env-file .env.e2e restart backend --wait`)
        return null
      },
      stopE2EDatabase() {
        execSync(`${COMPOSE} --profile e2e stop db_e2e`)
        execSync(`${COMPOSE} --env-file .env restart backend --wait`)
        return null
      }

    })
  },
  
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  },  
})