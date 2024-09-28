/**
 * My custom logger class
 *
 * This is helpful for me to keep a track of events in this application,
 * every event will be printed to the browser console as a log text
 * */
class Logger {
  /**
   * To handle log events
   * */
  public log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  /**
   * To handle errors
   * */
  public error(message: string) {
    console.error(`[${new Date().toISOString()}] ${message}`);
  }
}

export const logger = new Logger();
