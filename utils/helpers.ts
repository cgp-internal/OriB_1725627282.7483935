import { AppException, UnknownError } from "../models/exceptions";
import { promises as fs } from "fs";
import { appConfig } from "./config";
import { Request } from "express";
import mysql from "mysql2";


export async function logIt(msg: string, req?: Request) {
  const now = new Date();
  const timeString = now.toISOString().replace(/T/, " ").replace(/\..+/, ""); // Format: YYYY-MM-DD HH:MM:SS

  let logMessage = timeString;
  if (req) {
    logMessage += `: ${req.url}`;
    logMessage += `: ${req.ip}`;
  }
  logMessage += `: ${msg}`;

  try {
    await fs.appendFile(appConfig.logFile, logMessage, { flag: "a" });
    // console.log("logged");
  } catch (writeError) {
    console.error("Failed to write error to log file:", writeError);
    throw new UnknownError("Server Error");
  }
}

export async function logError(err: AppException, req?: Request) {
  const logMessage = `${err.status}: ${err.message}\n`;
  logIt(logMessage, req);
}

export async function isDbSeverUp() {  
  return new Promise((resolve) => {
    const connection = mysql.createConnection(appConfig.dbConfig);

    connection.connect(error => {
        if (error) {
            resolve(false);
        } else {
            resolve(true);
            connection.end();
        }
    });
});
}