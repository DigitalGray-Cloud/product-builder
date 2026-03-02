class ZodiacCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const zodiac = this.getAttribute('zodiac');
    const fortuneToday = this.getAttribute('fortune-today');
    const fortuneYear = this.getAttribute('fortune-year');
    const imageUrl = this.getImageUrl(zodiac);

    this.shadowRoot.innerHTML = `
      <style>
        .card-inner {
          position: relative;
          width: 100%;
          height: 400px; /* Increased height */
          transform-style: preserve-3d;
          transition: transform 0.8s;
        }
        .card.flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          border: 3px solid #FFD700; 
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.7), 
                      0 0 40px rgba(255, 215, 0, 0.5), 
                      0 0 60px rgba(255, 215, 0, 0.3);
          background-color: #0C0C0C; 
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          box-sizing: border-box; 
        }
        .card-front {
          
        }
        .card-back {
          transform: rotateY(180deg);
          color: #FFD700;
          font-size: 1.1rem;
          text-align: left;
          overflow-y: auto; /* For scrolling if content is too long */
        }
        .card-back h3 {
            border-bottom: 1px solid #FFD700;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .card-image {
          width: 150px; /* Increased size */
          height: 150px; /* Increased size */
          margin-bottom: 20px;
        }
        .zodiac-name {
            font-size: 2rem;
            font-weight: bold;
            margin-top: 10px;
        }
      </style>
      <div class="card" id="zodiac-card-instance">
        <div class="card-inner">
          <div class="card-face card-front">
            <img src="${imageUrl}" alt="${zodiac}" class="card-image">
            <p class="zodiac-name">${zodiac}</p>
          </div>
          <div class="card-face card-back">
            <h3>Today's Fortune (2026-03-02)</h3>
            <p>${fortuneToday}</p>
            <br>
            <h3>This Year's Fortune</h3>
            <p>${fortuneYear}</p>
          </div>
        </div>
      </div>
    `;
  }

  getImageUrl(zodiac) {
    const imageMap = {
        "Rat": "https://i.imgur.com/PlbQCo5.png",
        "Ox": "https://i.imgur.com/a5s8c6M.png",
        "Tiger": "https://i.imgur.com/GjA6T1M.png",
        "Rabbit": "https://i.imgur.com/ep23r65.png",
        "Dragon": "https://i.imgur.com/uCg3j3r.png",
        "Snake": "https://i.imgur.com/T0a5gH7.png",
        "Horse": "https://i.imgur.com/mRzAm88.png",
        "Sheep": "https://i.imgur.com/v82iPpr.png",
        "Monkey": "https://i.imgur.com/5l3zfaN.png",
        "Rooster": "https://i.imgur.com/gK9Vs8d.png",
        "Dog": "https://i.imgur.com/E8wTf2A.png",
        "Pig": "https://i.imgur.com/Rp2H0fP.png",
    };
    return imageMap[zodiac] || "https://i.imgur.com/placeholder.png"; 
  }
}

customElements.define('zodiac-card', ZodiacCard);

document.getElementById('fortune-button').addEventListener('click', () => {
  const birthYearInput = document.getElementById('birth-year-input');
  const year = parseInt(birthYearInput.value);
  if (!year || year < 1900 || year > new Date().getFullYear() + 10) {
    alert("Please enter a valid birth year.");
    return;
  }

  const zodiac = getZodiac(year);
  const fortunes = getFortunes(zodiac);

  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // Clear previous card

  const card = document.createElement('zodiac-card');
  card.setAttribute('zodiac', zodiac);
  card.setAttribute('fortune-today', fortunes.today);
  card.setAttribute('fortune-year', fortunes.year);

  cardContainer.appendChild(card);
  
  // Add a slight delay to ensure the card is in the DOM before flipping
  setTimeout(() => {
    const cardInstance = card.shadowRoot.getElementById('zodiac-card-instance');
    cardInstance.classList.add('flipped');
  }, 100);
});

function getZodiac(year) {
  const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep"];
  return animals[(year - 4) % 12];
}

function getFortunes(zodiac) {
  const fortunes = {
        "Rat": {
            "today": "A small windfall is headed your way. Keep your eyes peeled for unexpected opportunities.",
            "year": "A year of steady progress. Focus on your goals and you will achieve them. Be mindful of your health in the fall."
        },
        "Ox": {
            "today": "Patience is key today. Don't rush into decisions, especially financial ones.",
            "year": "This year brings stability and recognition for your hard work. A good time to build a solid foundation for the future."
        },
        "Tiger": {
            "today": "A burst of creative energy will lead to a breakthrough. Trust your instincts.",
            "year": "An exciting year full of changes and new adventures. Embrace the unknown and you will be rewarded."
        },
        "Rabbit": {
            "today": "A peaceful and harmonious day. Spend time with loved ones.",
            "year": "A calm and prosperous year. Your social life will flourish, and new friendships will be made."
        },
        "Dragon": {
            "today": "Your leadership skills will be in high demand. Step up and take charge.",
            "year": "A powerful and transformative year. You will have the opportunity to make a significant impact."
        },
        "Snake": {
            "today": "A day for introspection. Listen to your inner voice and you will find the answers you seek.",
            "year": "A year of wisdom and spiritual growth. Your intuition will be your guide to success."
        },
        "Horse": {
            "today": "An unexpected journey is on the horizon. Be prepared for a spontaneous trip.",
            "year": "A year of freedom and exploration. Travel and learning will be major themes."
        },
        "Sheep": {
            "today": "Your gentle nature will attract kindness and support from others.",
            "year": "A year of creativity and artistic expression. Your talents will be recognized and appreciated."
        },
        "Monkey": {
            "today": "A playful and mischievous day. Have fun, but don't get into too much trouble.",
            "year": "A year of innovation and clever solutions. Your wit and resourcefulness will be your greatest assets."
        },
        "Rooster": {
            "today": "Time to crow about your accomplishments. Don't be shy about sharing your successes.",
            "year": "A year of confidence and new beginnings. A good time to start a new project or venture."
        },
        "Dog": {
            "today": "Loyalty will be rewarded. A friend in need will appreciate your support.",
            "year": "A year of faithfulness and strong relationships. Your connections with others will deepen."
        },
        "Pig": {
            "today": "Indulge in some well-deserved relaxation. Treat yourself to something special.",
            "year": "A year of abundance and good fortune. You will enjoy the fruits of your labor."
        }
    };

  return fortunes[zodiac];
}
