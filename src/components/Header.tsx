import React from 'react';

const Header = () => {
  return (
    <header className="bg-header-green py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-header-green-foreground mb-4">
          clariZink – Tu Ruta Inteligente al Crédito
        </h1>
        <p className="text-lg md:text-xl text-header-green-foreground/80 max-w-4xl">
          Analiza tu situación financiera, descubre a qué créditos puedes acceder y simula cómo mejorar tus posibilidades con IA generativa. ¡Conversa además con nuestra coach financiera Clari!
        </p>
      </div>
    </header>
  );
};

export default Header;
