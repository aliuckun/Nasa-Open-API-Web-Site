using System;
using System.Net;
using System.Web.UI;
using System.IO;
using Newtonsoft.Json.Linq;

public partial class DataViewer : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string api = Request.QueryString["api"];
        if (api == "exo")
        {
            LoadExoplanetsServerSide();
        }
    }

    private void LoadExoplanetsServerSide()
    {
        string url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+20+pl_name,pl_rade,pl_eqt+from+ps+where+pl_rade+is+not+null+and+pl_eqt+is+not+null&format=json";


        try
        {
            using (WebClient client = new WebClient())
            {
                string json = client.DownloadString(url);
                JArray arr = JArray.Parse(json);

                string html = "<h3>🌌 Keşfedilen Ötegezegenler</h3><table border='1' cellpadding='6'><tr><th>Ad</th><th>Yarıçap (R🜨)</th><th>Denge Sıcaklığı (K)</th></tr>";

                for (int i = 0; i < Math.Min(20, arr.Count); i++)
                {
                    string name = arr[i]["pl_name"]?.ToString() ?? "-";
                    string radius = arr[i]["pl_rade"]?.ToString();
                    string temp = arr[i]["pl_eqt"]?.ToString();

                    radius = string.IsNullOrEmpty(radius) ? "Bilinmiyor" : radius;
                    temp = string.IsNullOrEmpty(temp) ? "Bilinmiyor" : temp;

                    html += $"<tr><td>{name}</td><td>{radius}</td><td>{temp}</td></tr>";
                }


                html += "</table>";

                contentDiv.Text = html; // ✅ DOĞRU
                pageTitle.Text = "🔬 Exoplanet Verileri"; // ✅ DOĞRU
            }
        }
        catch (Exception ex)
        {
            contentDiv.Text = "<p style='color:red;'>Veri alınırken hata oluştu: " + ex.Message + "</p>"; // ✅ DOĞRU
        }

    }
}
