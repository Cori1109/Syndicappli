using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Diagnostics;


namespace Live360Service
{
    class Live360Service
    {
        //Config Value
        private string mySid;
        private string adminURL;
        private string youtubeURL;
        private string cameraName;
        private string audioName;
        private string streamingCMD;

        //Status Value 
        private bool IsCameraConnected;
        private bool IsStreaming;

        private Process currentffmpeg;
        private long lastRetryTime;

        public WebSocket WSConnection { get; private set; }

        public void Start(string mySid, string adminURL, string youtubeURL, string cameraName, string audioName, string streamingCMD)
        {

            this.mySid = mySid;
            this.adminURL = adminURL;
            this.youtubeURL = youtubeURL;
            this.cameraName = cameraName;
            this.audioName = audioName;
            this.streamingCMD = streamingCMD;
            IsCameraConnected = false;
            Connect();

            foreach (var process in Process.GetProcessesByName("ffmpeg"))
            {
                process.Kill();
            }
        }

        public void Stop()
        {

        }

        public void Run()
        {

            //Retry connect with RetryTimeout : Default Value : 6000ms
            if (((lastRetryTime + Utility.RetryTimeout) < Utility.getNow()))
            {
                if (!WSConnection.IsAlive)
                {
                    Utility.WriteLogInfo("Retry Connect to WebSocket!");
                    Connect();
                }

                lastRetryTime = Utility.getNow();

                CheckCameraExist();

                if (IsConnected)
                    SendStatus();

                CheckStreamingStatus();
            }

            
            
                
        }

        public void Connect()
        {
            Utility.WriteLogInfo("Connect to WebSocket Server !!!");

            if (WSConnection != null && WSConnection.IsAlive)
                Disconnect();

            WSConnection = new WebSocket(adminURL);

            WSConnection.OnMessage += WebsocketMessageHandler;
            WSConnection.OnClose += (s, e) =>
            {
              //  if (Disconnected != null)
                //    Disconnected(this, e);
            };
            try { 
                WSConnection.Connect();
            }catch(Exception e)
            {

            }
            if (!WSConnection.IsAlive)
                return;

            lastRetryTime = Utility.getNow();

            SendHandShake();
        }

        public void SendStatus()
        {
            var status = new JObject();
            status.Add("isCameraConnected", IsCameraConnected);
            status.Add("youtubeURL", youtubeURL);
            status.Add("isStreaming", IsStreaming);
            var addtional = new JObject();
            addtional.Add("Status", status);
            addtional.Add("Message", "SendStatus");
            Send(addtional);
            Utility.WriteLogDebug("Send Status");
        }

        public void SendHandShake()
        {
            var addtional = new JObject();
            addtional.Add("Message", "Handshake");
            Send(addtional);
            Utility.WriteLogInfo("Send Handshake");
        }
        

        public void Send(JObject additionalFields = null)
        {
            var body = new JObject();
            body.Add("RequestType", "Service");
            body.Add("ServiceID", mySid);
            body.Merge(additionalFields);
            WSConnection.Send(body.ToString());
        }



        /// <summary>
        ///  Packet Receive part
        /// </summary>
        private void WebsocketMessageHandler(object sender, MessageEventArgs e)
        {
            if (!e.IsText)
                return;
            onReceive(e.Data);
        }

        private void parseCameracheck(string data)
        {
         //   Console.WriteLine(data);
            if (data == null)
                return;
            Console.WriteLine("------------");
            Console.WriteLine(data.IndexOf("Microphone (High Definition Audio Device)"));
            Console.WriteLine("------------");
            IsCameraConnected = true;
        }
        private void CheckStreamingStatus()
        {
            if (currentffmpeg != null)
                IsStreaming = !currentffmpeg.HasExited;
            else
                IsStreaming = false;

        }

        private bool CheckCameraExist()
        {
            string output = "";
            string error = "";
            Process ffmpeg = new Process
            {
                StartInfo = {
                    FileName = @"ffmpeg.exe",
                    Arguments = "-list_devices true -f dshow -i dummy",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    //WorkingDirectory = @"d:\tmp\videos\gopro"
                }
            };

            ffmpeg.EnableRaisingEvents = true;
            ffmpeg.OutputDataReceived += (s, e) => output += e.Data;
            ffmpeg.ErrorDataReceived += (s, e) => error += e.Data;
            ffmpeg.Start();
            ffmpeg.BeginOutputReadLine();
            ffmpeg.BeginErrorReadLine();
            ffmpeg.WaitForExit();

            Utility.WriteLogDebug("Camera = "+this.cameraName +":" + error.IndexOf(this.cameraName) +":Audio = "+ this.audioName + ":"+ error.IndexOf(this.audioName));

            if (error.IndexOf(this.cameraName) < 0 || error.IndexOf(this.audioName) < 0)
            {
                Utility.WriteLogDebug("Camera Not Exist !!! ");
                IsCameraConnected = false;
            }
            else
            {
                Utility.WriteLogDebug("Camera Exist !!! ");
                IsCameraConnected = true;
            }

            return IsCameraConnected;
        }

        private void StartStreaming()
        {
            Utility.WriteLogDebug("Receive Start Streaming.");
            if (youtubeURL == null || youtubeURL == "")
            {
                Utility.WriteLogError("Cannot Start Streaming because of Youtube URL not set."); 
                return;
            }
            if (!CheckCameraExist())
                return;
            string runCMD = String.Format(streamingCMD, "\""+this.cameraName+ "\"", "\""+this.audioName+ "\"", "\""+this.youtubeURL+ "\"");
            Utility.WriteLogDebug(runCMD);

            foreach (var process in Process.GetProcessesByName("ffmpeg"))
            {
                process.Kill();
            }

            string output = "";
            string error = "";
            Process ffmpeg = new Process
            {
                StartInfo = {
                    FileName = @"ffmpeg.exe",
                    Arguments = runCMD,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    //WorkingDirectory = @"d:\tmp\videos\gopro"
                }
            };

            ffmpeg.EnableRaisingEvents = true;
            ffmpeg.OutputDataReceived += (s, e) => Console.WriteLine(e.Data);
            ffmpeg.ErrorDataReceived += (s, e) => Console.WriteLine(e.Data);
            ffmpeg.Start();
            ffmpeg.BeginOutputReadLine();
            ffmpeg.BeginErrorReadLine();
            currentffmpeg = ffmpeg;

            CheckStreamingStatus();
            SendStatus();
        }


        private void StopStreaming()
        {
            Utility.WriteLogDebug("Receive Stop Streaming.");
            if (!currentffmpeg.HasExited)
                currentffmpeg.Kill();

            CheckStreamingStatus();
            SendStatus();
        }

        private void SetYoutubeURL(string url)
        {
            Utility.WriteLogDebug("Receive Set Youtube URL. :" + url);

            if (url == null || url == "")
                return;

            this.youtubeURL = url;

            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            config.AppSettings.Settings.Remove("YoutubeURL");
            config.AppSettings.Settings.Add("YoutubeURL", url);
            config.Save();

        }

        public void onReceive(string msg)
        {
            JObject body = JObject.Parse(msg);

            string reqType = null;
            string sID = null;
            string mType = null;
            string message = null;

            if (body["RequestType"] != null) { 
                reqType = (string)body["RequestType"];
            }
            if ( reqType != "FrontEnd")
                return;

            if (body["ServiceID"] != null)
            {
                reqType = (string)body["ServiceID"];
            }

            if (reqType != this.mySid)
                return;

            if (body["Type"] != null)
            {
                mType = (string)body["Type"];
            }

            if (mType == null) { 
                return;
            }else if (mType.ToLower() == "MessageSend".ToLower())
            {
                message = (string)body["Message"];
                if (message == null)
                    return;
                else if (message.ToLower() == "StartStreaming".ToLower())
                {
                    StartStreaming();
                }
                else if (message.ToLower() == "StopStreaming".ToLower())
                {
                    StopStreaming();
                }
                else if (message.ToLower() == "SetYoutubeURL".ToLower())
                {
                    SetYoutubeURL((string)body["Data"]);
                }
            }
        }

        public void Disconnect()
        {
            if (WSConnection != null)
                WSConnection.Close();

            WSConnection = null;
        }

        public bool IsConnected
        {
            get
            {
                return (WSConnection != null ? WSConnection.IsAlive : false);
            }
        }
    }

}
