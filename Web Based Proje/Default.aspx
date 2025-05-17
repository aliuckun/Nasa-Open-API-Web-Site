<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>NASA API Kategorileri</title>
    <link rel="stylesheet" href="Style.css?v=4" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <!-- Dönen yıldız katmanı (arka plan) -->
    <div class="rotating-stars"></div>

    <form id="form1" runat="server">
        <div class="container">
            <h2 class="title">🌌 NASA API Seçici</h2>

            <!-- Sabit ön plan resmi -->

            <label class="label2">Kategori Seç:</label><br />
            <asp:DropDownList ID="ddlCategory" runat="server" AutoPostBack="true"
                CssClass="dropdown" OnSelectedIndexChanged="ddlCategory_SelectedIndexChanged">
                <asp:ListItem Text="-- Seçiniz --" Value="" />
                <asp:ListItem Text="Görsel API'ler" Value="visual" />
                <asp:ListItem Text="Mars API'leri" Value="mars" />
                <asp:ListItem Text="Earth API'leri" Value="earth" />
                <asp:ListItem Text="Uzay Olayları" Value="events" />
                <asp:ListItem Text="Bilimsel API'ler" Value="science" />
            </asp:DropDownList>

            <br /><br />

            <label class="label2">API Seç:</label><br />
            <asp:DropDownList ID="ddlApi" runat="server" CssClass="dropdown" />

            <br /><br />
            <asp:Button ID="btnGoster" runat="server" Text="Veriyi Göster" CssClass="btn" OnClick="btnGoster_Click" />
        </div>
    </form>
</body>
</html>
