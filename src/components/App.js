import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import GameItem from './GameItem';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: [],
            gameNames: [],
            games: [],
            pc: [],
            xbox360: [],
            playStation3: [],
            playStationVita: [],
            macintosh: [],
            iPhone: [],
            sort: ''
        };

        this.search = this.search.bind(this);
        this.sortbyscore = this.sortbyscore.bind(this);
    }

    componentDidMount() {
        var self = this;

        fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json')
            .then(
                function (response) {
                    if (response.status !== 200) {
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        data.shift();
                        self.setState({
                            apiData: data,
                            games: data
                        });
                    });
                }
            )
            .catch(function (err) {
            });
    }

    search(query) {
        var games = [];
        var gameNames = [];
        var pc = []; 
        var xbox360= [];
        var playStation3= [];
        var playStationVita= [];
        var macintosh= [];
        var iPhone= [];
        

        this.state.apiData.forEach(function (game) {
            if (game.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                games.push(game);
                gameNames.push(game.title);
            }
            else {
                pc.push(game.platform === "PC")
                xbox360.push(game.platform === "Xbox 360")
                playStation3.push(game.platform === "PlayStation 3")
                playStationVita.push(game.platform === "PlayStation Vita")
                macintosh.push(game.platform === "Macintosh")
                iPhone.push(game.platform === "iPhone")
            }

            
           
        });

        this.state.apiData.forEach(function (game) {
            if (game.platform.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                pc.push(game.platform === "pc")
                xbox360.push(game.platform === "xbox 360")
                playStation3.push(game.platform === "PlayStation 3")
                playStationVita.push(game.platform === "PlayStation Vita")
                macintosh.push(game.platform === "Macintosh")
                iPhone.push(game.platform === "iPhone")
            }
         });

        this.setState({
            games: games,
            gameNames: gameNames,
            pc: pc,
            xbox360: xbox360,
            playStation3: playStation3,
            playStationVita: playStationVita,
            macintosh: macintosh,
            iPhone: iPhone,
            
        });
    }

    sortbyscore() {
        if (this.state.sort === "") {
            this.setState({
                pc: this.state.pc.reverse(),
                sort: 'dsc',
            });
        } else if (this.state.sort === "dsc") {
            this.setState({
                xbox360: this.state.xbox360.reverse(),
                sort: 'dsc1',
            }); 
        } else if (this.state.sort === "dsc1") {
            this.setState({
                playStation3: this.state.playStation3.reverse(),
                sort: 'dsc2',
            }); 
        } else if (this.state.sort === "dsc2") {
            this.setState({
                playStationVita: this.state.playStationVita.reverse(),
                sort: 'dsc3',
            }); 
        } else if (this.state.sort === "dsc3") {
            this.setState({
                macintosh: this.state.macintosh.reverse(),
                sort: 'dsc4',
            }); 
        }else if (this.state.sort === "dsc4") {
            this.setState({
                iPhone: this.state.iPhone.reverse(),
                sort: 'dsc5',
            }); 
        } else if (this.state.sort === "dsc5") {
            var games = this.state.games.sort(scoreComparator);
            this.setState({
                games: games,
                sort: 'dsc6',
            });
        } else if (this.state.sort === 'dsc6'){
            this.setState({
                games: this.state.games.reverse(),
                sort: 'dsc7',
            });
        } else 
            this.setState({
                games: this.state.games.reverse(),
                sort: "",
            });
         
        
    }

    render() {
        var GameList = this.state.games.map(function (game, index) {
            return (
                <GameItem key={index} data={game}/>
                
            );
        }, this);

        return (
            <div>
                <center>
                    <div className="margin-3">
                        <AutoComplete
                            hintText="Search..."
                            dataSource={this.state.gameNames}
                            onUpdateInput={this.search}
                            listStyle={{maxHeight: 200, overflow: 'auto'}}
                            fullWidth={true}
                        />
                        <RaisedButton className="margin-3" label={(this.state.sort === "" && "PC") ||(this.state.sort === "dsc" && "Xbox 360") ||(this.state.sort === "dsc1" && "PlayStation 3") ||(this.state.sort === "dsc2" && "PlayStation Vita") ||(this.state.sort === "dsc3" && "Macintosh") ||(this.state.sort === "dsc4" && "iPhone") ||(this.state.sort === "dsc5" && "Sort by Score") ||(this.state.sort === "dsc6" && "Sort by Score(High to Low)") || (this.state.sort === "dsc7" && "Sort by Score (Low to High)")} primary={true} onClick={this.sortbyscore} />
                    </div>
                </center>
                <div className="margin-3 flex-box">{GameList}</div>
            </div>
        );
    }
}

export default App;

function scoreComparator(a, b) {
    return parseInt(a.score, 10) - parseInt(b.score, 10);
}
