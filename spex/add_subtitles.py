import os

titles = {
    "oresundsbron.html": "Öresundsbron 2025 (BRO)",
    "hc_andersen.html": "H.C. Andersen 2024 (HCA)",
    "kristina.html": "Kristina 2023/24 (KRI)",
    "kraftor.html": "Kräftor Kräva Dessa Drycker! 2023 (KRÄ)",
    "hilma.html": "Hilma af Klint 2022/23 (HIL)",
    "loshultskuppen.html": "Loshultskuppen 2022 (LOS)",
    "sketchostrof.html": "Sketchostrof 2022 (ROF)",
    "erik_xiv.html": "Erik XIV 2021 (E14)",
    "lafayette.html": "Lafayette 2019/20 (LAF)",
    "eva_ekeblad.html": "Eva Ekeblad 2019 (EVA)",
    "leonardo.html": "Leonardo 2018/19 (LEO)",
    "synden_i_molle.html": "Synden i Mölle 2018 (SIM)",
    "sketchofori.html": "Sketchofori 2018 (SKO)",
    "katarina.html": "Katarina den stora 2017 (KAT)",
    "hindenburg.html": "Hindenburg 2017 (HIN)",
    "kleopatra.html": "Kleopatra 2016 (KLE)",
    "lewinsky.html": "Lewinsky 2016 (LEW)",
    "stalin.html": "Stalin 2015/16 (STA)",
    "taget_over_balt.html": "Tåget över bält 2015 (TÖB)",
    "karthago.html": "Karthago 2014/15 (PUN)",
    "den_lagsta_punkten.html": "Den lägsta punkten 2014 (HÅL)",
    "sketchetera.html": "Sketchetera 2014 (ETC)",
    "rosetta.html": "Rosettastenen 2013 (O)",
    "kubakrisen.html": "Kubakrisen 2013 (KUK)",
    "franz_ferdinand.html": "Franz Ferdinand 2012/13 (FRA)",
    "jerusalem.html": "Jerusalem 2012 (JER)",
    "martell.html": "Karl Martell 2011/12 (KAR)",
    "per_albin.html": "Per Albin Hansson 2011 (PAH)",
    "caesar.html": "Caesar 2010 (CAE)",
    "sketchistens.html": "Sketchistens 2010 (FEL)",
    "darwin.html": "Darwin 2009 (DAR)",
    "tjogun.html": "Tjogun 2009 (TJO)",
    "nobel.html": "Nobel 2007/08 (NOB)",
    "os_feber.html": "OS-feber i Kristianstad 2007 (OSF)",
    "maria_eleonora.html": "Maria Eleonora 2006 (MAR)",
    "sketchofreni.html": "Sketchofreni 2006 (SEV)",
    "linne.html": "Carl von Linné 2005 (CvL)",
    "finlands.html": "Finlands Bryggeri 2004 (FIN)",
    "carl_xi.html": "Carl XI 2003 (CXI)",
    "sketchup.html": "Sketchup 2003 (SKE)",
    "mot_strommen.html": "Mot Strömmen 2000/01 (MOT)",
    "nosaby.html": "Nosaby 2000 (NOS)",
    "kejsaren.html": "Kejsaren av Kina 1999/2000 (KEJ)",
    "gustav_iii.html": "Gustav III 1999 (GUS)",
    "hjalmar.html": "Hjalmar Söderberg 1998 (HJA)",
    "nisse.html": "Lille Nisses stora klocka 1998 (NIS)",
    "eiffel.html": "Eiffel 1997 (EIF)",
    "florence.html": "Florence 1996/97 (FLO)",
    "charles_magnusson.html": "Charles Magnusson 1995 (CHA)",
    "sannladan.html": "Sannlådan 1994 (SAN)",
    "pullinutt.html": "Prinsessan Pullinutt 1993/94 (PUL)",
    "sokrates.html": "Sokrates 1991/92 (SOK)",
    "mtv.html": "MTV 1990 (MTV)",
    "christian_iv.html": "Christian IV 1992 (CIV)",
    "lincoln.html": "Lincoln 1990 (LIN)",
    "krook.html": "Kapten Krook 1989 (KRO)",
    "gyttjeblottning.html": "Gyttjeblottning 1986 (GYT)",
    "general.html": "Allmänna (ALL)",
    "favourites.html": "Favoriter"
}

count = 0
for filename, title in titles.items():
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<h2>' not in content:
            new_content = content.replace('</h1>', f'</h1>\n\n<h2>{title}</h2>')
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Added subtitle to {filename}")
            count += 1

print(f"\nTotal: Added subtitles to {count} files")
