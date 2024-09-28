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
  public info(message: string) {
    console.log(`[${new Date().toISOString()}][INFO] ${message}`);
  }

  /**
   * To handle errors
   * */
  public error(message: string) {
    console.log(`[${new Date().toISOString()}][ERROR] ${message}`);
  }

  /**
   * To handle warnings
   * */
  public warn(message: string) {
    console.log(`[${new Date().toISOString()}][WARN] ${message}`);
  }
}

export const logger = new Logger();
