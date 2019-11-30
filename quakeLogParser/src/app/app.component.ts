import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "quakeLogParser";


  fileLines: string[];
  count: number = 0;
  games: number[] = [];
  nGames: number = 0;

  //Atributos do jogo
  kills = [];
  players: string[] = [];
  auxPlayer: string[] = [];
  linePlayers: string[] = [];

  readFile($event): void {
    this.readThis($event.target);
  }

  readThis(valueInput: any): void {
    var file: File = valueInput.files[0];
    var reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      this.logResult(reader.result);
    };
  }

  logResult(log) {
    this.fileLines = log.split(/[0-9]?[0-9]?[0-9]:[0-9][0-9]/);

    this.fileLines.forEach(line => {
      //Busca a quantidade de jogos
      if (line.includes(" InitGame:")) {
        this.nGames++;
        this.count = 0;
      }
      //Busca a quantidade total de kill em cada partida
      if (line.includes("Kill: ")) {
        this.count++;
        if (this.kills[0]) {
          this.count = 0;
        }
      }
      //Buca a linha onde se encontra nome dos jogadores
      if (line.includes("ClientUserinfoChanged")) {
        let inicio = line.indexOf(`n\\`) + 2;
        let fim = line.indexOf("\\t") - 1;
        let name: string = "";
        while (inicio <= fim) {
          name += line[inicio];
          inicio++;
        }
        this.players.push(name);
        //Não permite que tenha dois jogadores com o mesmo nome
        this.auxPlayer = this.players.filter(
          (este, i) => this.players.indexOf(este) === i
        );
      }
      this.players = this.auxPlayer;
      this.kills[this.nGames - 1] = this.count;
      this.games[this.nGames - 1] = this.nGames;
    });
  }
}
