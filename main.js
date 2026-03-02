const translations = {
  en: {
    title: "Fortune Teller",
    subtitle: "Discover your destiny in the stars",
    inputPlaceholder: "Year",
    buttonText: "Reveal My Fortune",
    todayFortuneHeader: "Today's Insight",
    yearFortuneHeader: "Yearly Path",
    invalidYear: "Please enter a valid birth year.",
    zodiacNames: {
        "Rat": "Rat", "Ox": "Ox", "Tiger": "Tiger", "Rabbit": "Rabbit", 
        "Dragon": "Dragon", "Snake": "Snake", "Horse": "Horse", "Sheep": "Sheep", 
        "Monkey": "Monkey", "Rooster": "Rooster", "Dog": "Dog", "Pig": "Pig"
    },
    fortunes: {
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
    }
  },
  ko: {
    title: "띠별 운세",
    subtitle: "별들에 새겨진 당신의 운명을 확인하세요",
    inputPlaceholder: "출생연도",
    buttonText: "운세 확인하기",
    todayFortuneHeader: "오늘의 조언",
    yearFortuneHeader: "올해의 흐름",
    invalidYear: "올바른 출생 연도를 입력해주세요.",
    zodiacNames: {
        "Rat": "쥐띠", "Ox": "소띠", "Tiger": "호랑이띠", "Rabbit": "토끼띠", 
        "Dragon": "용띠", "Snake": "뱀띠", "Horse": "말띠", "Sheep": "양띠", 
        "Monkey": "원숭이띠", "Rooster": "닭띠", "Dog": "개띠", "Pig": "돼지띠"
    },
    fortunes: {
        "Rat": {
            "today": "작은 횡재수가 따르는 날입니다. 예상치 못한 기회를 놓치지 마세요.",
            "year": "꾸준한 발전이 기대되는 한 해입니다. 목표에 집중하면 반드시 결실을 맺을 것입니다."
        },
        "Ox": {
            "today": "오늘은 인내심이 필요합니다. 서두르지 말고 신중하게 결정하세요.",
            "year": "그동안의 노력이 인정받고 안정기에 접어듭니다. 미래를 위한 기초를 다지기에 좋은 시기입니다."
        },
        "Tiger": {
            "today": "창의적인 에너지가 넘치는 날입니다. 자신의 직감을 믿고 행동하세요.",
            "year": "변화와 새로운 모험으로 가득한 활기찬 한 해가 될 것입니다. 변화를 즐기세요."
        },
        "Rabbit": {
            "today": "평화롭고 조화로운 하루입니다. 사랑하는 사람들과 소중한 시간을 보내세요.",
            "year": "평온하고 번창하는 한 해입니다. 대인관계가 원만해지고 새로운 인연이 생길 것입니다."
        },
        "Dragon": {
            "today": "당신의 리더십이 빛을 발하는 날입니다. 자신 있게 앞장서서 상황을 이끄세요.",
            "year": "강력한 변화와 성장의 기회가 찾아오는 해입니다. 큰 영향력을 발휘할 수 있습니다."
        },
        "Snake": {
            "today": "자기 성찰에 좋은 날입니다. 내면의 목소리에 귀를 기울이면 답을 찾을 수 있습니다.",
            "year": "지혜와 정신적 성장이 돋보이는 한 해입니다. 직관이 성공의 길로 인도할 것입니다."
        },
        "Horse": {
            "today": "뜻밖의 여정이 기다리고 있습니다. 새로운 경험에 마음을 열어두세요.",
            "year": "자유와 탐험의 해입니다. 여행과 배움을 통해 많은 것을 얻게 될 것입니다."
        },
        "Sheep": {
            "today": "당신의 친절함이 주변의 도움과 지지를 끌어당기는 날입니다.",
            "year": "창의성과 예술적 감각이 풍부해지는 해입니다. 당신의 재능이 인정받게 될 것입니다."
        },
        "Monkey": {
            "today": "즐겁고 유쾌한 일이 생기는 날입니다. 재치를 발휘해 상황을 즐기세요.",
            "year": "혁신과 기발한 해결책이 돋보이는 한 해입니다. 당신의 영리함이 큰 자산이 됩니다."
        },
        "Rooster": {
            "today": "당신의 성취를 널리 알려도 좋은 날입니다. 자신감을 가지고 당당해지세요.",
            "year": "자신감 넘치는 새로운 시작의 해입니다. 새로운 프로젝트를 시작하기에 최적의 시기입니다."
        },
        "Dog": {
            "today": "신의를 지키면 큰 보답이 따릅니다. 주변 사람들에게 따뜻한 관심을 보여주세요.",
            "year": "신뢰와 깊은 유대감이 형성되는 해입니다. 소중한 사람들과의 관계가 더욱 깊어집니다."
        },
        "Pig": {
            "today": "충분한 휴식이 필요한 날입니다. 자신을 위해 작은 선물을 해보세요.",
            "year": "풍요와 행운이 가득한 한 해입니다. 그동안 노력한 대가를 충분히 누리게 될 것입니다."
        }
    }
  }
};

let currentLang = 'en';

function updateLanguage(lang) {
    currentLang = lang;
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-ko').classList.toggle('active', lang === 'ko');
    
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('subtitle').textContent = translations[lang].subtitle;
    document.getElementById('birth-year-input').placeholder = translations[lang].inputPlaceholder;
    document.getElementById('fortune-button').textContent = translations[lang].buttonText;
    
    // Update active card if it exists
    const card = document.querySelector('zodiac-card');
    if (card) {
        card.render();
    }
}

document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));
document.getElementById('lang-ko').addEventListener('click', () => updateLanguage('ko'));

class ZodiacCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const zodiac = this.getAttribute('zodiac');
    const lang = currentLang;
    const t = translations[lang];
    const fortuneData = t.fortunes[zodiac];
    const zodiacName = t.zodiacNames[zodiac];
    const imageUrl = this.getImageUrl(zodiac);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 20px auto;
          max-width: 400px;
        }
        .card {
          width: 100%;
          height: 500px;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card.flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 24px;
          border: 2px solid rgba(255, 215, 0, 0.6);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 215, 0, 0.1);
          background: linear-gradient(145deg, #0f0f1a 0%, #050505 100%);
          display: flex;
          flex-direction: column;
          padding: 30px;
          box-sizing: border-box;
          overflow: hidden;
        }
        .card-front {
          justify-content: center;
          align-items: center;
        }
        .card-back {
          transform: rotateY(180deg);
          color: #e0e0e0;
          text-align: left;
        }
        .card-face::before {
            content: '';
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            pointer-events: none;
        }
        .zodiac-image {
          width: 200px;
          height: 200px;
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
          margin-bottom: 2rem;
          transition: transform 0.3s ease;
        }
        .card:hover .zodiac-image {
            transform: scale(1.1);
        }
        .zodiac-name {
          font-size: 2.5rem;
          color: #FFD700;
          font-family: 'Playfair Display', serif;
          margin: 0;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        h3 {
            color: #FFD700;
            font-size: 1.2rem;
            margin: 20px 0 10px 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            padding-bottom: 5px;
        }
        p {
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
            color: #ccc;
        }
        .ornament {
            position: absolute;
            font-size: 2rem;
            opacity: 0.2;
            color: #FFD700;
        }
        .top-left { top: 20px; left: 20px; }
        .bottom-right { bottom: 20px; right: 20px; }
      </style>
      <div class="card" id="card-element">
        <div class="card-inner">
          <div class="card-face card-front">
            <span class="ornament top-left">✦</span>
            <img src="${imageUrl}" alt="${zodiac}" class="zodiac-image">
            <h2 class="zodiac-name">${zodiacName}</h2>
            <span class="ornament bottom-right">✦</span>
          </div>
          <div class="card-face card-back">
            <h3>${t.todayFortuneHeader}</h3>
            <p>${fortuneData.today}</p>
            <h3>${t.yearFortuneHeader}</h3>
            <p>${fortuneData.year}</p>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('card-element').addEventListener('click', function() {
        this.classList.toggle('flipped');
    });

    // Auto flip after a short delay when first created
    if (!this.hasFlippedOnce) {
        setTimeout(() => {
            this.shadowRoot.getElementById('card-element').classList.add('flipped');
            this.hasFlippedOnce = true;
        }, 300);
    }
  }

  getImageUrl(zodiac) {
    const imageMap = {
        "Rat": "https://cdn-icons-png.flaticon.com/512/3094/3094851.png",
        "Ox": "https://cdn-icons-png.flaticon.com/512/3094/3094836.png",
        "Tiger": "https://cdn-icons-png.flaticon.com/512/3094/3094840.png",
        "Rabbit": "https://cdn-icons-png.flaticon.com/512/3094/3094856.png",
        "Dragon": "https://cdn-icons-png.flaticon.com/512/3094/3094842.png",
        "Snake": "https://cdn-icons-png.flaticon.com/512/3094/3094844.png",
        "Horse": "https://cdn-icons-png.flaticon.com/512/3094/3094846.png",
        "Sheep": "https://cdn-icons-png.flaticon.com/512/3094/3094854.png",
        "Monkey": "https://cdn-icons-png.flaticon.com/512/3094/3094849.png",
        "Rooster": "https://cdn-icons-png.flaticon.com/512/3094/3094858.png",
        "Dog": "https://cdn-icons-png.flaticon.com/512/3094/3094838.png",
        "Pig": "https://cdn-icons-png.flaticon.com/512/3094/3094860.png",
    };
    return imageMap[zodiac] || "https://cdn-icons-png.flaticon.com/512/3094/3094851.png"; 
  }
}

customElements.define('zodiac-card', ZodiacCard);

document.getElementById('fortune-button').addEventListener('click', () => {
  const birthYearInput = document.getElementById('birth-year-input');
  const year = parseInt(birthYearInput.value);
  const t = translations[currentLang];

  if (!year || year < 1900 || year > new Date().getFullYear() + 10) {
    alert(t.invalidYear);
    return;
  }

  const zodiac = getZodiac(year);
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; 

  const card = document.createElement('zodiac-card');
  card.setAttribute('zodiac', zodiac);
  cardContainer.appendChild(card);
});

function getZodiac(year) {
  const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep"];
  return animals[(year - 4) % 12];
}
