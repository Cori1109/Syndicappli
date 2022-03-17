using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Security.Cryptography;
using System.Threading;
using SimpleLogger;
using SimpleLogger.Logging.Handlers;
using SimpleLogger.Logging.Module;
using System.Diagnostics;

namespace Live360Service
{
    class Program
    {
        
        static void Main(string[] args)
        {
            Logger.LoggerHandlerManager .AddHandler(new ConsoleLoggerHandler()).AddHandler(new DebugConsoleLoggerHandler()); 

            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

            string mySid = ConfigurationManager.AppSettings.Get("ServiceID");
            if (mySid == null)
            { 
                mySid = Utility.generateServiceID();
                config.AppSettings.Settings.Remove("ServiceID");
                config.AppSettings.Settings.Add("ServiceID", mySid);
            }

            //Admin URL Set 
            string adminURL = ConfigurationManager.AppSettings.Get("AdminURL");
            
            if (adminURL == null)
            {
                Utility.WriteLogError("Invalid Admin URL.\n");
                return;
            }

            // RTMP Publish URL
            string youtubeURL = ConfigurationManager.AppSettings.Get("YoutubeURL");

            if (youtubeURL == null)
            {
                Utility.WriteLogError("Not Exist Youtube URL.\n");
            }


            // Debug Level Set
            string LogDebugVal = ConfigurationManager.AppSettings.Get("LogDebug");
            bool isLogDebug = bool.Parse(LogDebugVal);
            if (isLogDebug)
                Logger.DebugOn();
            else
                Logger.DebugOff();

            string cameraName = ConfigurationManager.AppSettings.Get("CameraName");

            if (cameraName == null)
            {
                Utility.WriteLogError("Not Exist Camera Name.\n");
                return;
            }

            string audioName = ConfigurationManager.AppSettings.Get("AudioName");

            if (audioName == null)
            {
                Utility.WriteLogError("Not Exist Audio Name.\n");
                return;
            }

            string StreamingCMD = ConfigurationManager.AppSettings.Get("StreamingCMD");

            if (StreamingCMD == null)
            {
                Utility.WriteLogError("Not Exist Streaming Command.\n");
                return;
            }


            config.Save();


            // End Load Config File 

            Utility.WriteLogInfo("Config File Loaded.");

            Live360Service service = new Live360Service();
            service.Start(mySid, adminURL, youtubeURL, cameraName, audioName, StreamingCMD);


            // Process Check
            int i = 0;
            foreach (var process in Process.GetProcessesByName("Live360Service"))
            {
                i++;
            }
            if (i >= 2)
                return;


            while (true)
            {
                service.Run();
                Thread.Sleep(10);
            }

            service.Stop();
        }
    }
}
