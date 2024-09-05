import { spawn, ChildProcess } from 'child_process'
import { dirname, join } from 'path'
import chalk from 'chalk'
import figlet from 'figlet'
import { fileURLToPath } from 'url'

// Create a function for flashy logging
const logFlashy = (message: string) => {
  console.log(chalk.magentaBright.bold(message))
}

const logSuccess = (message: string) => {
  console.log(chalk.green.bold(message))
}

const logHeader = () => {
  console.log(
    chalk.redBright.bold(
      figlet.textSync('BrightSide Developer', {
        font: 'Sub-Zero',
        horizontalLayout: 'controlled smushing',
      })
    )
  )
  console.log(chalk.yellow.bold('Run Native'))
  console.log(chalk.white('---------------------------------------------'))
}

// Print the header
logHeader()

const __dirname = dirname(fileURLToPath(import.meta.url))

// Define the paths
const webFolder = join(__dirname, 'web')
const nativeFolder = join(__dirname, 'native')

// Store references to the spawned processes
const processes: ChildProcess[] = []

// Function to spawn a process and handle its output
const runCommand = (command: string, args: string[], cwd: string) => {
  const process = spawn(command, args, { cwd, stdio: 'inherit', shell: true })
  processes.push(process) // Store reference to the process

  process.on('close', (code) => {
    if (code === 0) {
      logSuccess(`Process ${command} finished successfully!`)
    } else {
      console.error(chalk.red(`Process ${command} exited with code ${code}`))
    }
  })
}

// Run the web server
logFlashy('Running npm run dev in the web folder...')
runCommand('npm', ['run', 'dev'], webFolder)

// Run the native server
logFlashy('Running npm start in the native folder...')
runCommand('npm', ['start'], nativeFolder)

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.redBright.bold('\nGracefully shutting down...'))

  // Kill all spawned processes
  processes.forEach((proc) => {
    proc.kill('SIGINT')
  })

  process.exit() // Exit the main process
})

// Final Success Message
logSuccess('WOOOHOOOO! Running on Expo go on your local network! 🎉🚀')
console.log(chalk.blueBright.bold(figlet.textSync('To Ez', { font: '3D-ASCII', horizontalLayout: 'controlled smushing' })))
