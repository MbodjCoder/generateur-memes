import GrilleGalerie from "@/composants/galerie/GrilleGalerie";

// Page de la galerie des mèmes
export default function PageGalerie() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Galerie de <span className="text-accent">mèmes</span>
        </h1>
        <p className="text-texte-secondaire">
          Retrouvez et modifiez vos mèmes créés précédemment
        </p>
      </div>
      <GrilleGalerie />
    </div>
  );
}
