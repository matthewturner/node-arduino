import * as readline from 'readline';
import { Logger, ILogObj } from 'tslog';
import { SerialPort, ReadlineParser } from 'serialport';

export const logger = new Logger<ILogObj>();
logger.settings.minLevel = 3;

if (process.argv.length === 2) {
	logger.error('Supply arduino port (eg COM5)');
	process.exit(2);
}

const usbPort = process.argv[2];

logger.info(`Connecting to ${usbPort}...`);

const port = new SerialPort({
	path: usbPort,
	baudRate: 115200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	autoOpen: true
});

let connected = false;

port.on('open', function (err) {
	if (err) {
		logger.error(err);
	}
	logger.info("Connected to arduino...");
	connected = true;
});

const parser = port.pipe(new ReadlineParser());

parser.on('data', function (data) {
	logger.info(data);
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function promptForCommand() {
	rl.question('Enter command...', (command) => {
		logger.info(`Writing command: ${command}...`);
		port.write(command);
		promptForCommand();
	});
}

promptForCommand();