import { Injectable } from '@angular/core';
import * as Genetic from 'genetic-js';

@Injectable({
  providedIn: 'root'
})
export class PolynomialService {

  // 50, 100, 300, 500, 1000, 2000
  iterations = 500;

  // 0.0 to 1.0
  mutation = 1.0;
  // Genetic.Select1.
  // [Tournament2, Tournament3, Fittest, Random, RandomLinearRank, Sequential]
  singleSelection = 'Genetic.Select1.FittestRandom';

  // 0.0 to 1.0
  crossover = 250;
  // Genetic.Select2.
  // [Tournament2, Tournament3, Random, RandomLinearRank, Sequential, FittestRandom]
  pairSelection = 'Genetic.Select1.FittestRandom';

  // INPUT: [x, y] array
  vertices = [];

  // 0 (constant), 1 (line), 2 (parabola), 3 (polynomial), 4 (polynomial)
  degree = 4;

  private createGenetic(cfg) {
    const yValues = cfg.userData.vertices.map(x => x[1]);
    cfg.userData.min = yValues.reduce((o, x) => Math.min(o, x));
    cfg.userData.max = yValues.reduce((o, x) => Math.max(o, x));
    cfg.userData.range = Math.abs(cfg.userData.max - cfg.userData.min);
    console.log(cfg.userData.range);

    var genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.FittestRandom;
    genetic.seed = function() {
      
      var a = [];
      // create coefficients for polynomial with values between (-0.5, 0.5)
      // if the dimensions are 10 x 10
      // but adjust based on range
      var i;
      for (i=0;i<this.userData.terms;++i) {
        let value = (Math.random()-0.5) * this.userData.range / 10;
        if (this.userData.exponential && i === 1) {
          value = 1 + Math.random() * 0.001;
        }
        a.push(value);
      }
      
      return a;
    };
    genetic.mutate = function(entity) {
      var i = Math.floor(Math.random()*entity.length);
      const exp = this.userData.exponential && i === 1;
      const increment = exp ? 0.0001 : 0.05;

      // allow chromosomal drift with this range (-0.05, 0.05)
      var drift = ((Math.random()-0.5)*2) * increment;

      entity[i] += drift;
      if (exp) {
        entity[i] = Math.max(1, entity[i]);
      }

      return entity;
    };
    genetic.crossover = function(mother, father) {
      // crossover via interpolation
      function lerp(a, b, p) {
        return a + (b-a)*p;
      }
      
      var len = mother.length;
      var i = Math.floor(Math.random()*len);
      var r = Math.random();
      var son = [].concat(father);
      var daughter = [].concat(mother);
      
      son[i] = lerp(father[i], mother[i], r);
      daughter[i] = lerp(mother[i], father[i], r);
      
      return [son, daughter];
    };

    // example 3 term polynomial with exponential: gx^0 + fx^1 + ex^2 + ab^(cx + d)
    genetic.evaluateEquation = function(entity, x) {
      let coefficients = entity;
      let a = 0;
      let b = 0;
      let c = 0;
      let d = 0;
      if (this.userData.exponential) {
        a = entity[0];
        b = Math.abs(entity[1]);
        c = entity[2];
        d = entity[3];
        coefficients = entity.slice(2);
      }

      // example 3 term polynomial: cx^0 + bx^1 + ax^2
      return (function(coefficients, x) {
        var s = 0;
        var p = 1;
        var i;
        for (i=0;i<coefficients.length;++i) {
          s += p*coefficients[i];
          p *= x;
        }
        return s;
      })(coefficients, x) +

      // exponential: ab^(cx + d)
      (a ? (function(a, b, c, d, x) {
        return a * Math.pow(b, x);
        // return Math.pow(a, x);
        //return a * Math.pow(b, c * x + d);
      })(a, b, c, d, x) : 0);
    }
      
    genetic.fitness = function(entity) {
      
      var sumSqErr = 0;
      var vertices = this.userData["vertices"];
      
      var i;
      for (i=0;i<vertices.length;++i) {
        var err = this.evaluateEquation(entity, vertices[i][0]) - vertices[i][1];
        sumSqErr += err*err;
      }
      
      return Math.sqrt(sumSqErr);
    };
    genetic.generation = function(pop, generation, stats) {
    };
    genetic.notification = function(pop, generation, stats, isFinished) {
      const entity = pop[0].entity;
      let coefficients = entity;
      let a = 0;
      let b = 0;
      let c = 0;
      let d = 0;
      if (this.userData.exponential) {
        a = entity[0];
        b = Math.abs(entity[1]);
        c = entity[2];
        d = entity[3];
        coefficients = entity.slice(2);
      }

      function poly() {
        var arr = [];
        var i;
        if (a) {
          arr.push(a + " * " + b + "<sup><em><b>x</b></em></sup>");
        }
        for (i=coefficients.length-1;i>=0;--i) {
          var buf = coefficients[i].toPrecision(2);
          if (i > 1)
            buf += "<em><b>x<sup>" + i + "</sup></b></em>";
          else if (i == 1)
            buf += "<em><b>x</b></em>";
            
          arr.push(buf);
        }
        return arr.join(" + ");
      }

      console.log(generation + 1, pop[0]);
      const fitness = pop[0].fitness || 0;
      const result = {
        solution: poly(),
        generation: generation + 1,
        bestFit: fitness.toPrecision(4),
        vertexError: (fitness/cfg.userData.vertices.length).toPrecision(4),
        avgBestFit: stats.mean.toPrecision(4),
        errorStDev: stats.stdev.toPrecision(4),
        run: x => genetic.evaluateEquation(entity, x)
      };
      console.log(result);
      if (generation + 1 === cfg.config.iterations) {
        cfg.callback(result);
      }
      return result;
    };

		genetic.evolve(cfg.config, cfg.userData);
    return genetic;
  }

  async find(vertices) {
    return new Promise(resolve => {
      this.createGenetic({
        config: {
          exponential: true,
          iterations: this.iterations,
          size: 250,
          crossover: this.crossover,
          mutation: this.mutation,
          skip: 10
        },
        userData: {
          exponential: false,
          terms: 4,
          vertices: vertices
        },
        callback: result => resolve(result)
      });
    });
  }
}
