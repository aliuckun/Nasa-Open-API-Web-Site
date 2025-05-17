<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DataViewer.aspx.cs" Inherits="DataViewer" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>NASA API Verisi</title>
    <link rel="stylesheet" href="Style.css?v=2" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="DataScripts.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <!-- Server-side başlık (EXO için) -->
            <h2 id="serverTitle" runat="server" class="title">
                <asp:Literal ID="pageTitle" runat="server" />
            </h2>

            <div id="serverContent" runat="server" class="content-box">
                <asp:Literal ID="contentDiv" runat="server" Mode="PassThrough" />
            </div>

            <!-- Client-side başlık (diğer API'ler için) -->
            <h2 id="jsTitle" style="display:none;" class="title"></h2>
            <div id="jsContent" class="content-box"></div>
        </div>
    </form>

    <script type="text/javascript">
        const urlParams = new URLSearchParams(window.location.search);
        const api = urlParams.get('api');

        if (api !== 'exo') {
            const serverTitleId = "<%= serverTitle.ClientID %>";
            const serverContentId = "<%= serverContent.ClientID %>";

            const serverTitleEl = document.getElementById(serverTitleId);
            const serverContentEl = document.getElementById(serverContentId);

            if (serverTitleEl) serverTitleEl.style.display = "none";
            if (serverContentEl) serverContentEl.style.display = "none";

            document.getElementById("jsTitle").style.display = "block";

            switch (api) {
                case 'apod': loadAPOD(); break;
                case 'imageLib': loadImageLibrary(); break;
                case 'videoLib': loadVideoLibrary(); break;
                case 'rover': loadMarsPhotos(); break;
                case 'marsWeather': loadMarsWeather(); break;
                case 'earthImagery': loadEarthImagery(); break;
                case 'epic': loadEpic(); break;
                case 'donkiFlr': loadSolarEvents(); break;
                case 'neows': loadAsteroids(); break;
                case 'genelab': loadGeneLab(); break;
                default:
                    document.getElementById("jsContent").innerHTML = "<p style='color:red;'>❌ Geçersiz API seçimi.</p>";
            }
        }
    </script>
</body>
</html>
