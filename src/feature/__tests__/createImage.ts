import sharp from 'sharp';

export async function createImage(outputPath: string): Promise<void> {
  try {
    // Tworzenie obrazu o wymiarach 800x600 pikseli
    const width = 800;
    const height = 600;

    // Ustalamy kolor tła (np. niebieski)
    const backgroundColor = { r: 0, g: 0, b: 255 };

    // Tworzenie grafiki
    await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: backgroundColor,
      },
    })
      .png() // Można zmienić format na jpg, svg, itp.
      .toFile(outputPath);

    console.log(`Obraz został zapisany w: ${outputPath}`);
  } catch (error) {
    console.error('Wystąpił błąd podczas tworzenia grafiki:', error);
  }
}
