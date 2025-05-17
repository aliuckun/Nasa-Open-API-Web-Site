using System;
using System.Web.UI.WebControls;

public partial class Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            ddlApi.Items.Clear();
            ddlApi.Items.Add(new ListItem("-- Önce kategori seçin --", ""));
        }
    }

    protected void ddlCategory_SelectedIndexChanged(object sender, EventArgs e)
    {
        ddlApi.Items.Clear();
        string category = ddlCategory.SelectedValue;

        switch (category)
        {
            case "visual":
                ddlApi.Items.Add(new ListItem("APOD (Astronomy Picture of the Day)", "apod"));
                ddlApi.Items.Add(new ListItem("Image Library", "imageLib"));
                ddlApi.Items.Add(new ListItem("Video Library", "videoLib")); 
                break;

            case "mars":
                ddlApi.Items.Add(new ListItem("Mars Rover Photos", "rover"));
                ddlApi.Items.Add(new ListItem("Mars Weather (Geliştiriliyor)", "marsWeather"));
                break;

            case "earth":
                ddlApi.Items.Add(new ListItem("Earth Imagery", "earthImagery"));
                ddlApi.Items.Add(new ListItem("EPIC (Geliştiriliyor)", "epic"));
                break;

            case "events":
                ddlApi.Items.Add(new ListItem("Güneş Patlamaları (DONKI FLR)", "donkiFlr"));
                ddlApi.Items.Add(new ListItem("Asteroid (NeoWs)", "neows"));
                break;

            case "science":
                ddlApi.Items.Add(new ListItem("Exoplanet Archive", "exo"));
                ddlApi.Items.Add(new ListItem("GeneLab (Geliştiriliyor)", "genelab"));
                break;
        }
    }

    protected void btnGoster_Click(object sender, EventArgs e)
    {
        string category = ddlCategory.SelectedValue;
        string api = ddlApi.SelectedValue;

        if (!string.IsNullOrEmpty(category) && !string.IsNullOrEmpty(api))
        {
            Response.Redirect($"DataViewer.aspx?category={category}&api={api}");
        }
    }
}
