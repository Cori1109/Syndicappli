using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

using SimpleLogger;

namespace Live360Service
{
    class Utility
    {
        public static long RetryTimeout = 6000;
        public static long getNow()
        {
            return (DateTime.UtcNow.Ticks - 621355968000000000) / 10000;
        }

        public static string GetMd5Hash(MD5 md5Hash, string input)
        {

            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public static string generateServiceID()
        {
            MD5 md5Hash = MD5.Create();
            long nowValue = getNow();
            string hash = GetMd5Hash(md5Hash, nowValue.ToString());
            return hash;
        }
        
        public static void WriteLogDebug( string log)
        {
            Logger.Debug.Log(log);
        }

        public static void WriteLogError(string log)
        {
            Logger.Log(Logger.Level.Error, log);
        }

        public static void WriteLogInfo(string log)
        {
            Logger.Log(Logger.Level.Info, log);
        }

    }
}
