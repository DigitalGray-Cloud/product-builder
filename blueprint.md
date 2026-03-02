# Fortune Teller Website Blueprint

## **Overview**

A web application that provides users with a unique and visually appealing fortune-telling experience. Users can enter their birth year to see their Korean zodiac sign, represented by a spinning, elegantly designed card. The card reveals both a "fortune for the day" and a "fortune for the year."

## **Design and Style**

*   **Theme:** Luxurious and mystical.
*   **Color Palette:**
    *   **Primary Background:** Black (`#000000`) with a subtle noise texture for a premium feel.
    *   **Primary Accent:** Gold (`#FFD700` and various shades) for text, borders, and highlights.
*   **Typography:**
    *   **Headings:** An elegant, serif font to convey a sense of tradition and mystique.
    *   **Body Text:** A clean, readable sans-serif font.
*   **Card Design:**
    *   A 3D-like appearance with multi-layered drop shadows to make it feel "lifted" off the page.
    *   Gold foil-style borders and accents.
    *   The front of the card will show the Zodiac animal's image.
    *   The back of the card (revealed after a spin) will display the fortune text.
*   **Interactivity:**
    *   The card will perform a 360-degree spinning animation on the Y-axis when the fortune is requested.
    *   Buttons and input fields will have a soft "glow" effect on focus or hover.

## **Features**

*   **Birth Year Input:** A simple and clear input field for the user to enter their year of birth.
*   **Zodiac Calculation:**
    *   The application will calculate the user's Korean zodiac animal based on their birth year.
    *   The 12 Zodiac animals are: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Sheep, Monkey, Rooster, Dog, Pig.
*   **Dynamic Card Generation:**
    *   A Web Component (`<zodiac-card>`) will be used to create the fortune card dynamically.
    *   The component will be responsible for its own structure, style (via Shadow DOM), and the spinning animation.
*   **Fortune Content:**
    *   **Today's Fortune:** Displays a fortune for a fixed date: March 2, 2026.
    *   **This Year's Fortune:** Displays a general fortune for the user's zodiac year.
    *   The content will be unique for each of the 12 zodiac signs.
*   **Responsive Design:** The layout will be fully responsive and accessible on both desktop and mobile devices.

## **Current Plan**

1.  **Structure (`index.html`):** Set up the main HTML file with a container for the app, including a title, an input for the birth year, and a button.
2.  **Styling (`style.css`):**
    *   Implement the black and gold color scheme and background texture.
    *   Style the main layout, input fields, and buttons.
    *   Define the spinning animation and base card styles.
3.  **Logic (`main.js`):**
    *   Create the `ZodiacCard` Web Component to manage the card's appearance and behavior.
    *   Implement the zodiac calculation logic.
    *   Add an event listener to the button to trigger the fortune generation process.
    *   Define the fortune text for each zodiac sign.
    *   Find and use high-quality, thematic images for each zodiac animal.
