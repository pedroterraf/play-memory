import { useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';

const Counter = ({ props }) => <span>{props.seconds === 0 ? '60' : props.seconds} Sec</span>;

const Timer = ({ start, setStart, setSave, score }) => {
    const [showInitialCountdown, setShowInitialCountdown] = useState(false);
    const [initialCountdown, setInitialCountdown] = useState(5);
    const timeRef = useRef();

    const handleInitialCountdownEnd = () => {
        setShowInitialCountdown(false);
        timeRef.current.start(); // Inicia el contador principal de 60 segundos
    };

    const handleEnd = () => {
        setStart(false);
        setSave(true);
    };

    useEffect(() => {
        console.log(start)
        if (start) {
            setShowInitialCountdown(true);
            setInitialCountdown(5);
        }
    }, [start, score]);

    // Efecto para la cuenta regresiva inicial
    useEffect(() => {
        let initialCountdownTimer;
        if (showInitialCountdown) {
            initialCountdownTimer = setInterval(() => {
                setInitialCountdown(prevCount => prevCount - 1);
            }, 1000);
        }
        // Cuando la cuenta regresiva inicial llega a 0, se inicia el contador principal
        if (initialCountdown === 0) {
            clearInterval(initialCountdownTimer);
            handleInitialCountdownEnd();
        }

        return () => clearInterval(initialCountdownTimer);
    }, [showInitialCountdown, initialCountdown]);

    return (
        <div className="timer">
            <h3>
                <Countdown
                    date={Date.now() + 60000}
                    renderer={props => <Counter props={props} />}
                    onComplete={handleEnd}
                    autoStart={false}
                    ref={timeRef}
                />
            </h3>
            {initialCountdown !== 0 && <span>{initialCountdown} Sec</span>}
        </div>
    );
};

export default Timer;
