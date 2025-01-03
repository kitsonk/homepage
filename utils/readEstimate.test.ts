import { assertEquals } from "@std/assert/equals";
import { readEstimate } from "./readEstimate.ts";

Deno.test({
  name: "readEstimate - basic",
  fn() {
    const actual = readEstimate(
      `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
        minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut
        aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
        vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla
        facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent
        luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        
        Epsum factorial non deposit quid pro quo hic escorol. Olypian quarrels et
        gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum.
        Defacto lingo est igpay atinlay. Marquee selectus non provisio incongruous
        feline nolo contendre. Gratuitous octopus niacin, sodium glutimate. Quote meon
        an estimate et non interruptus stadium. Sic tempus fugit esperanto hiccup
        estrogen. Glorious baklava ex librus hup hey ad infinitum. Non sequitur
        condominium facile et geranium incognito. Epsum factorial non deposit quid pro
        quo hic escorol. Marquee selectus non provisio incongruous feline nolo contendre
        Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus
        carborundum e pluribus unum.
        
        Li Europan lingues es membres del sam familie. Lor separat existentie es un
        myth. Por scientie, musica, sport etc, li tot Europa usa li sam vocabularium. Li
        lingues differe solmen in li grammatica, li pronunciation e li plu commun
        vocabules. Omnicos directe al desirabilita; de un nov lingua franca: on refusa
        continuar payar custosi traductores. It solmen va esser necessi far uniform
        grammatica, pronunciation e plu sommun paroles.
        
        Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e
        regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu
        simplic e regulari quam li existent Europan lingues. It va esser tam simplic
        quam Occidental: in fact, it va esser Occidental. A un Angleso it va semblar un
        simplificat Angles, quam un skeptic Cambridge amico dit me que Occidental es.
        
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
        minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut
        aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
        vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla
        facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent
        luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        
        Epsum factorial non deposit quid pro quo hic escorol. Olypian quarrels et
        gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum.
        Defacto lingo est igpay atinlay. Marquee selectus non provisio incongruous
        feline nolo contendre. Gratuitous octopus niacin, sodium glutimate. Quote meon
        an estimate et non interruptus stadium. Sic tempus fugit esperanto hiccup
        estrogen. Glorious baklava ex librus hup hey ad infinitum. Non sequitur
        condominium facile et geranium incognito. Epsum factorial non deposit quid pro
        quo hic escorol. Marquee selectus non provisio incongruous feline nolo contendre
        Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus
        carborundum e pluribus unum.
        
        Li Europan lingues es membres del sam familie. Lor separat existentie es un
        myth. Por scientie, musica, sport etc, li tot Europa usa li sam vocabularium. Li
        lingues differe solmen in li grammatica, li pronunciation e li plu commun
        vocabules. Omnicos directe al desirabilita; de un nov lingua franca: on refusa
        continuar payar custosi traductores. It solmen va esser necessi far uniform
        grammatica, pronunciation e plu sommun paroles.
        `,
    );
    assertEquals(actual, 3);
  },
});
