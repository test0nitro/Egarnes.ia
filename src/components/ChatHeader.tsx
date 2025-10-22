const ChatHeader = () => {
  return (
    <div className="text-center py-8 px-4">
      <div className="flex justify-center items-center gap-3 mb-3">
        <span className="text-5xl">🌺</span>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Egarnes.ia
        </h1>
        <span className="text-5xl">🏖️</span>
      </div>
      <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
        Votre tuteur virtuel de portugais dans le climat tropical de Fernando de Noronha ☀️
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Traduire entre le français et le portugais • Apprendre avec des conseils culturels 🇧🇷
      </p>
    </div>
  );
};

export default ChatHeader;
