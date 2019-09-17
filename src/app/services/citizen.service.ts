import { Injectable } from '@angular/core';

function r(n) {
  return Math.floor(Math.random() * n);
}

@Injectable({
  providedIn: 'root'
})
export class CitizenService {

  // https://www.abs.gov.au/ausstats/Subscriber.nsf/log?openagent&65230do002_201718.xlsx&6523.0&Data%20Cubes&F32A15932FBB35B6CA25843400189D9E&0&2017-18&12.07.2019&Latest
  // adults, has-children, min-age, max-age, 1st%, 2nd%, 3rd%, 4th%, 5th%
  householdAgeQuintiles = [
    [2, 1, 15, 44, 16.1, 27.9, 25.8, 18.6, 11.6],
    [2, 1, 45, 89, 5.9, 12.0, 16.9, 27.2, 38.4],
    [1, 1, 15, 44, 65.7, 16.5, 10.9, 3.3, 3.8],
    [1, 1, 45, 89, 29.0, 19.8, 21.4, 19.6, 11.1 ],
    [2, 0, 15, 44, 30.2, 40.1, 17.8, 7.1, 4.5],
    [2, 0, 45, 64, 3.8, 10.3, 20.0, 30.2, 35.6],
    [2, 0, 65, 89, 4.7, 7.3, 23.7, 28.1, 36.1],
    [3, 1, 15, 44, 41.1, 30.7, 11.6, 7.7, 9.5],
    [3, 1, 45, 89, 10.0, 15.0, 16.4, 29.0, 29.6],
    [1, 0, 15, 24, 87.5, 5.7, 3.1, 0.0, 0.9],
    [1, 0, 25, 44, 46.5, 31.7, 14.5, 5.2, 1.9],
    [1, 0, 45, 64, 26.4, 23.8, 21.9, 16.8, 11.1],
    [1, 0, 65, 89, 19.7, 15.9, 27.3, 21.4, 15.5]
  ];

  // https://www.abs.gov.au/ausstats/Subscriber.nsf/log?openagent&65230do002_201718.xlsx&6523.0&Data%20Cubes&F32A15932FBB35B6CA25843400189D9E&0&2017-18&12.07.2019&Latest
  // [index = ((index + 1) * 10)th person)], thousands
  wealthRanges = [
    20.3,
    64.2,
    137.0,
    238.3,
    348.2,
    472.0,
    624.6,
    861.3,
    1355.7
  ];

  population = 24966530;

  // https://www.abs.gov.au/ausstats/Subscriber.nsf/log?openagent&65230do002_201718.xlsx&6523.0&Data%20Cubes&F32A15932FBB35B6CA25843400189D9E&0&2017-18&12.07.2019&Latest
  // min, max, households
  // [0][0] is estimated to be -50,000
  // [last][1] is estimated to be 20,000,000
  // There is a great unknown between the top and the richest,
  // 20,000,000 (wealthy) and 500,000,000 (50th richest)
  // ... this should be added as a sliver of households - perhaps 1000.
  betterWealthRanges = [
    [-50000, 0, 127300],
    [0, 50000, 1105200],
    [50000, 100000, 599300],
    [100000, 150000, 432200],
    [150000, 200000, 348800],
    [200000, 250000, 329800],
    [250000, 300000, 291800],
    [300000, 350000, 251900],
    [350000, 400000, 294100],
    [400000, 450000, 270300],
    [450000, 500000, 258300],
    [500000, 600000, 548300],
    [600000, 700000, 449500],
    [700000, 800000, 409700],
    [800000, 900000, 348900],
    [900000, 1000000, 323300],
    [1000000, 1100000, 324300],
    [1100000, 1200000, 282700],
    [1200000, 1400000, 418100],
    [1400000, 1600000, 315700],
    [1600000, 1800000, 232500],
    [1800000, 2000000, 198700],
    [2000000, 2200000, 162700],
    [2200000, 2400000, 132800],
    [2400000, 2600000, 103900],
    [2600000, 3000000, 136000],
    [3000000, 4000000, 233100],
    [4000000, 5000000, 120000],
    [5000000, 7000000, 117800],
    [7000000, 10000000, 47000],
    [10000000, 20000000, 58600]
  ];

  // https://www.abs.gov.au/ausstats/Subscriber.nsf/log?openagent&65230do001_201718.xlsx&6523.0&Data%20Cubes&9B5A9B39A5BB6421CA25843400189CFB&0&2017-18&12.07.2019&Latest
  incomeRanges = [

  ];

  // https://en.wikipedia.org/wiki/List_of_Australians_by_net_worth
  // name, billions
  richestPeople = [
    ["Blair Parry-Okeden", 8.8],
    ["Gina Rinehart", 8.50],
    ["Harry Triguboff", 6.90],
    ["Frank Lowy", 5.00],
    ["Anthony Pratt", 3.60],
    ["James Packer", 3.50],
    ["John Gandel", 3.20],
    ["Lindsay Fox", 2.80],
    ["David Teoh", 1.95],
    ["David Hains", 1.90],
    ["Kerr Neilson", 1.85],
    ["Fiona Geminder", 1.83],
    ["Michael Hintze", 1.80],
    ["Mike Cannon-Brookes", 1.78],
    ["Scott Farquhar", 1.75],
    ["Wilson Family", 1.60],
    ["Stan Perron", 1.54],
    ["Jack Cowin", 1.50],
    ["Gerry Harvey", 1.35],
    ["Heloise Waislitz", 1.30],
    ["Alan Rydge", 1.27],
    ["Andrew Forrest", 1.24],
    ["Bob Ell", 1.20],
    ["Maurice Alter", 1.10],
    ["Beverly Barlow ", 1.10],
    ["Lang Walker", 1.02],
    ["Kerry Stokes", 1.00],
    ["John Van Lieshout", 0.97],
    ["Angela Bennett", 0.93],
    ["Solomon Lew", 0.92],
    ["Paul Little", 0.83],
    ["Tony ", 0.77],
    ["Len Ainsworth", 0.76],
    ["Bob Ingham", 0.745],
    ["John Kahlbetzer", 0.74],
    ["Sam Tarascio", 0.735],
    ["Judith Neilson", 0.72],
    ["Con Makris", 0.70],
    ["Reg Rowe", 0.675],
    ["Ralph Sarich", 0.66],
    ["Maha Sinnathamby", 0.65],
    ["Brett Blundy", 0.645],
    ["Bruce Mathieson", 0.64],
    ["Richard Smith", 0.615],
    ["Graham Turner", 0.575],
    ["Bruce Gordon", 0.57],
    ["Nigel Austin", 0.565],
    ["Christopher Morris", 0.55],
    ["Gretel Packer", 0.51],
    ["Marcus Blackmore", 0.50]
  ];


  // Gender, Age, Amount
  ageGenderStats = [
    ["M", 0, 158199],
    ["M", 1, 160277],
    ["M", 2, 163291],
    ["M", 3, 165723],
    ["M", 4, 164128],
    ["M", 5, 165628],
    ["M", 6, 166252],
    ["M", 7, 165165],
    ["M", 8, 165223],
    ["M", 9, 164582],
    ["M", 10, 163548],
    ["M", 11, 162794],
    ["M", 12, 159254],
    ["M", 13, 153592],
    ["M", 14, 149980],
    ["M", 15, 148072],
    ["M", 16, 147341],
    ["M", 17, 150630],
    ["M", 18, 157470],
    ["M", 19, 164194],
    ["M", 20, 168095],
    ["M", 21, 171012],
    ["M", 22, 177290],
    ["M", 23, 186646],
    ["M", 24, 191345],
    ["M", 25, 190054],
    ["M", 26, 188708],
    ["M", 27, 189292],
    ["M", 28, 190967],
    ["M", 29, 189549],
    ["M", 30, 187047],
    ["M", 31, 185838],
    ["M", 32, 185471],
    ["M", 33, 184942],
    ["M", 34, 183643],
    ["M", 35, 182932],
    ["M", 36, 180001],
    ["M", 37, 175247],
    ["M", 38, 169472],
    ["M", 39, 163505],
    ["M", 40, 159507],
    ["M", 41, 157494],
    ["M", 42, 157629],
    ["M", 43, 158373],
    ["M", 44, 160584],
    ["M", 45, 163445],
    ["M", 46, 166676],
    ["M", 47, 169433],
    ["M", 48, 164771],
    ["M", 49, 158011],
    ["M", 50, 153896],
    ["M", 51, 149598],
    ["M", 52, 147965],
    ["M", 53, 148072],
    ["M", 54, 150599],
    ["M", 55, 153919],
    ["M", 56, 153961],
    ["M", 57, 152638],
    ["M", 58, 148910],
    ["M", 59, 144261],
    ["M", 60, 140915],
    ["M", 61, 137407],
    ["M", 62, 134626],
    ["M", 63, 130567],
    ["M", 64, 125471],
    ["M", 65, 123119],
    ["M", 66, 121031],
    ["M", 67, 118798],
    ["M", 68, 116628],
    ["M", 69, 113315],
    ["M", 70, 111941],
    ["M", 71, 113603],
    ["M", 72, 105301],
    ["M", 73, 92508],
    ["M", 74, 86591],
    ["M", 75, 78967],
    ["M", 76, 73160],
    ["M", 77, 68774],
    ["M", 78, 63123],
    ["M", 79, 58534],
    ["M", 80, 53651],
    ["M", 81, 49276],
    ["M", 82, 45042],
    ["M", 83, 39987],
    ["M", 84, 35460],
    ["M", 85, 31679],
    ["M", 86, 28177],
    ["M", 87, 25443],
    ["M", 88, 22770],
    ["M", 89, 19315],
    ["F", 0, 149536],
    ["F", 1, 151497],
    ["F", 2, 154244],
    ["F", 3, 156887],
    ["F", 4, 155787],
    ["F", 5, 157056],
    ["F", 6, 157614],
    ["F", 7, 156758],
    ["F", 8, 156978],
    ["F", 9, 156176],
    ["F", 10, 155161],
    ["F", 11, 154400],
    ["F", 12, 150765],
    ["F", 13, 145154],
    ["F", 14, 141241],
    ["F", 15, 140127],
    ["F", 16, 140213],
    ["F", 17, 142921],
    ["F", 18, 149015],
    ["F", 19, 154858],
    ["F", 20, 158894],
    ["F", 21, 163417],
    ["F", 22, 169666],
    ["F", 23, 177427],
    ["F", 24, 182313],
    ["F", 25, 183380],
    ["F", 26, 185078],
    ["F", 27, 188508],
    ["F", 28, 192346],
    ["F", 29, 192789],
    ["F", 30, 191359],
    ["F", 31, 190342],
    ["F", 32, 190086],
    ["F", 33, 189780],
    ["F", 34, 187996],
    ["F", 35, 186080],
    ["F", 36, 181994],
    ["F", 37, 176568],
    ["F", 38, 170863],
    ["F", 39, 165199],
    ["F", 40, 161325],
    ["F", 41, 159120],
    ["F", 42, 158981],
    ["F", 43, 159920],
    ["F", 44, 162524],
    ["F", 45, 166646],
    ["F", 46, 171770],
    ["F", 47, 176532],
    ["F", 48, 172303],
    ["F", 49, 165465],
    ["F", 50, 161599],
    ["F", 51, 156450],
    ["F", 52, 154078],
    ["F", 53, 153811],
    ["F", 54, 156397],
    ["F", 55, 159569],
    ["F", 56, 159280],
    ["F", 57, 158333],
    ["F", 58, 155630],
    ["F", 59, 151058],
    ["F", 60, 147889],
    ["F", 61, 144772],
    ["F", 62, 141309],
    ["F", 63, 137686],
    ["F", 64, 133816],
    ["F", 65, 131054],
    ["F", 66, 127580],
    ["F", 67, 124554],
    ["F", 68, 122165],
    ["F", 69, 118164],
    ["F", 70, 115699],
    ["F", 71, 116881],
    ["F", 72, 108515],
    ["F", 73, 96355],
    ["F", 74, 91417],
    ["F", 75, 84310],
    ["F", 76, 78766],
    ["F", 77, 75086],
    ["F", 78, 70419],
    ["F", 79, 66568],
    ["F", 80, 62528],
    ["F", 81, 58625],
    ["F", 82, 54804],
    ["F", 83, 50288],
    ["F", 84, 45805],
    ["F", 85, 42317],
    ["F", 86, 39174],
    ["F", 87, 36759],
    ["F", 88, 34243],
    ["F", 89, 30232]
  ];

  citizens = [];

  segments = [];

  constructor() {
    // calc cumulative
    const a = this.ageGenderStats;
    a.forEach((x, i) => {
      x[3] = x[2] + (i ? (a[i - 1][3] as any) : 0);
    });

    // WEALTH
    const b = this.betterWealthRanges;
    const rp = this.richestPeople;
    const richestPeopleSegment = [
      rp[rp.length - 1][1] as any * 1000000000,
      rp[0][1] as any * 1000000000,
      rp.length
    ];

    let rpTotal = 0;
    rp.forEach(x => {
      rpTotal += x[1] as number * 1000000000;
    });

    const richPeopleSegment = [
      b[b.length - 1][1],
      richestPeopleSegment[0],
      Math.round((b[b.length - 1][2] as any + richestPeopleSegment[2] as any) / 2)
    ];

    b.push(richPeopleSegment);
    b.push(richestPeopleSegment);

    // calc cumulative
    b.forEach((x, i) => {
      x[3] = x[2] + (i ? (b[i - 1][3] as any) : 0);
    });

    const totalPopulation = this.population;
    const totalHouseholds = b[b.length - 1][3];
    const peoplePerHouseHold = totalPopulation / totalHouseholds;

    // calc per person
    b.forEach((x, i) => {
      if (i < b.length - 1) {
        // fix wealth for individuals
        x[4] = Math.round(x[0] / peoplePerHouseHold);
        x[5] = i !== b.length - 2 ? Math.round(x[1] / peoplePerHouseHold) : x[1];
        // fix population for household size
        x[6] = Math.round(x[3] * peoplePerHouseHold);
      } else {
        x[4] = x[0];
        x[5] = x[1];
        x[6] = b[i - 1][6] + x[2];
      }
    });

    const segments = [];
    b.forEach((x, i) => {
      const seg = {
        householdMin: x[0],
        householdMax: x[1],
        households: x[2],
        householdStart: x[3],
        householdGradient: (x[1] - x[0]) / x[2],
        personMin: x[4],
        personMax: x[5],
        personStart: x[6],
        people: Math.round(x[2] * peoplePerHouseHold),
        total: (x[0] + x[1]) / 2 * x[2]
      };
      // Need to presume there is a sharp logarithmic curve on this.
      if (i === 31) {
        const lastGradient = segments[i - 1].householdGradient;
        const householdMaxEst = (lastGradient * 5) * x[2] + x[0];
        seg.total = Math.round((x[0] + householdMaxEst) / 2 * x[2]);
      }
      segments.push(seg);
    });
    segments[segments.length - 1].people = 50;
    segments[segments.length - 1].total = rpTotal;
    this.segments = segments;
  }

  getRandomGenderAndAge() {
    const a = this.ageGenderStats;
    const population = a[a.length-1][3];
    const personIndex = r(population);
    const group = a.find(x => x[3] > personIndex) || a[a.length-1];
    return {
      gender: group[0],
      age: group[1]
    };
  }

  getRandomWealth() {
    const a = this.betterWealthRanges;
    const population = a[a.length-1][3];
    const personIndex = r(population);
    const group = a.find(x => x[3] > personIndex) || a[a.length-1];
    return r(group[1] - group[0]) + group[0];
  }

  getAll(qty = 100) {
    let citizens = this.citizens;
    if (!citizens.length) {
      for (var i = 0; i < qty; i += 1) {
        const group = this.getRandomGenderAndAge();
        const wealth = this.getRandomWealth();
        citizens.push({
          gender: group.gender,
          age: group.age,
          wealth
        });
      }
      citizens = citizens.sort((a, b) => a.wealth - b.wealth);
    }
    return citizens;
  }
}
