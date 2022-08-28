using HtmlAgilityPack;
using System.Text;

namespace SuperMusicSongExtractor
{
    public class SongWrapper
    {
        public string? Title { get; set; }
        public HtmlNode? DOM { get; set; }
    }

    internal class Program
    {

        static HtmlDocument GetDocument(string url)
        {
            HtmlWeb web = new();
            HtmlDocument doc = web.Load(url);
            return doc;
        }

        static HtmlNode? GetSimpleNode_Piesen(HtmlNode doc)
        {
            return doc.Descendants().Where(n => n.HasClass("piesen") && n.Name.Equals("table")).FirstOrDefault();
        }

        static string GetSongTitle(HtmlNode doc)
        {
            var nodes = doc.SelectSingleNode("//title");
            var text = nodes.InnerText;

            int index = text.IndexOf("[");
            if (index >= 0)
            {
                text = text.Substring(0, index);
            }

            return text; ;
        }

        static void SimplifyHTML(HtmlNode doc)
        {
            doc.Descendants()
                       .Where(n => n.Name == "script" || n.Name == "style")
                       .ToList()
                       .ForEach(n => n.Remove());

            var nodes = doc.SelectNodes("//a");
            foreach (var node in nodes)
            {
                node.ParentNode.RemoveChild(node, true);
            }

            nodes = doc.SelectNodes("//tr");
            foreach (var node in nodes)
            {
                node.ParentNode.RemoveChild(node, true);
            }

            nodes = doc.SelectNodes("//td");
            foreach (var node in nodes)
            {
                node.ParentNode.RemoveChild(node, true);
            }


            nodes = doc.SelectNodes("//font");
            foreach (var node in nodes)
            {
                node.ParentNode.RemoveChild(node, true);
            }
        }

        static SongWrapper GetNode_Piesen(string url)
        {
            HtmlDocument doc = GetDocument(url);
            SimplifyHTML(doc.DocumentNode);

            return new SongWrapper()
            {
                Title = GetSongTitle(doc.DocumentNode),
                DOM = GetSimpleNode_Piesen(doc.DocumentNode)
            };
        }

        static string GetSongHTML(SongWrapper songObject)
        {
            StringBuilder html = new();

            html.Append(@$"
<html>
<head>
    <title>{songObject.Title}</title>
    <link rel=""stylesheet"" href=""./../../display/default.css"">
</head>
<body>
    <section class=""song"">
");
            html.Append(songObject.DOM.InnerHtml.ToString());

            html.Append(@$"
    </section>
</body>
</html>
");

            return html.ToString();
        }



        static string OutputFolderPath => $@"{ Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)}\mroot\temp";

        static void Main(string[] args)
        {
            string url;

            if (args.Length != 1)
            {
                Console.WriteLine("used clipboard");
                url = TextCopy.ClipboardService.GetText();
            }
            else
            {
                url = args[0];
            }

            try
            {
                var songObject = GetNode_Piesen(url);
                Directory.CreateDirectory(OutputFolderPath);

                File.WriteAllText($@"{OutputFolderPath}\{songObject.Title}.html",
                GetSongHTML(songObject));
            }
            catch (Exception e)
            {
                Console.Error.WriteLine(e.Message);
                Console.Error.WriteLine("---\n---\n---");
                Console.Error.WriteLine(e.StackTrace);
            }
        }
    }

}


