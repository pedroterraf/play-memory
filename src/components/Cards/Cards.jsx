import './Cards.css';
import { getImages } from '../../helpers/getImages';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

let size = 3;
let clicks = 0;

const Cards = ({ start, score, initialView, setInitialView }) => {
    const [images, setImages] = useState(getImages(size));
    const [selected, setSelected] = useState([]);
    const [opened, setOpened] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if (start) {
                setInitialView(false);
            }
        }, 5000);
    }, [images, start]);

    const handleClick = (item, index) => {
        if (!initialView && start && !selected.includes(item) && !opened.includes(item) && flippedCards.indexOf(index) === -1) {
            clicks++;
            if (selected.length < 2) {
                setSelected(selected => [...selected, item]);
                setFlippedCards(flippedCards => [...flippedCards, index]);
            }
        }
    };

    useEffect(() => {
        if (selected.length === 2) {
            if (selected[0].split('|')[1] === selected[1].split('|')[1]) {
                setOpened(opened => [...opened, ...selected]);
            }
            setTimeout(() => {
                setSelected([]);
                setFlippedCards([]);
            }, 500);
        }
    }, [selected]);

    useEffect(() => {
        if (opened.length === images.length) {
            calculateScore();
            setTimeout(() => {
                size += 2;
                clearArrays();
                setImages(getImages(size));
                setInitialView(true);
            }, 500);

            confetti({
                particleCount: 200,
                startVelocity: 30,
                spread: 300,
                gravity: 1.5,
                origin: { y: 0 }
            });
        }
    }, [opened]);

    const calculateScore = () => {
        const passLevel = size * 10;
        let total = score.current;
        const cards = size * 2;
        if (clicks === cards) {
            total += (cards * 2) + passLevel;
        } else if (clicks > cards && clicks < cards + 5) {
            total += cards + passLevel;
        } else if (clicks > cards + 5 && clicks < cards + 10) {
            total += (cards / 2) + passLevel;
        } else {
            total += Math.round(cards / 3) + passLevel;
        }
        clicks = 0;
        score.current = total;
    };

    const clearArrays = () => {
        setSelected([]);
        setOpened([]);
        setFlippedCards([]);
    };

    let include = false;
    return (
        <div className="cards">
            <h2>Score: {score.current} Pts</h2>
            <ul className='ul'>
                {images.map((item, index) => (
                    <li key={index} onClick={() => handleClick(item, index)} className={`flip ${flippedCards.includes(index) ? 'flipped' : ''}`}>
                        <div className="content">
                            { include = selected.includes(item) || opened.includes(item) }
                            {initialView || selected.includes(item) || opened.includes(item) ? (
                                <div className={`back ${include ? 'flip-back' : 'flip-back'}`}>
                                    <img src={item.split('|')[1] ? item.split('|')[1] : "/question.png"} alt="icon" className="images-back" />
                                    <div className="pixelated-border"></div> {/* Añadir borde pixelado aquí */}
                                </div>
                            ) : (
                                <div className={`front ${include ? 'flip-back' : 'flip-back'}`}>
                                    <img src={"/question.png"} alt="icon" className="images-front" />
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cards;
