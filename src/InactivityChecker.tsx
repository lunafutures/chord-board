import React, { JSX } from "react";

export function InactivityChecker(props: { thresholdMillis: number }): JSX.Element {
    return <>
        <HiddenTabChecker thresholdMillis={props.thresholdMillis}/>
        <UserInactivityChecker thresholdMillis={props.thresholdMillis} />
    </>;
}

function HiddenTabChecker(props: { thresholdMillis: number }): JSX.Element {
    const visibilityChangeTimeRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        function handleVisibilityChange(): void {
            if (document.hidden) {
                console.log(`Document is hidden at ${new Date(Date.now())}`);
                visibilityChangeTimeRef.current = Date.now();
            } else {
                console.log(`Document is visible at ${new Date(Date.now())}`);
                if (visibilityChangeTimeRef.current !== null) {
                    const inactivityDuration = Date.now() - visibilityChangeTimeRef.current;
                    console.log(`Document was hidden for ${inactivityDuration} ms.`);
                    if (inactivityDuration > props.thresholdMillis) {
                        console.log('Reloading page...');
                        window.location.reload();
                    }
                }
            }
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return (): void => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    return <></>;
}

enum InactivityState {
    NeverInactive = 'never-inactive',
    CurrentlyInactive = 'currently-inactive',
    WasInactive = 'was-inactive',
}

const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
function UserInactivityChecker(props: { thresholdMillis: number }): JSX.Element {
    const [inactivity, setInactivity] = React.useState(InactivityState.NeverInactive);
    const timerHandle = React.useRef<NodeJS.Timeout | null>(null);

    resetupInactivityTimer();
    React.useEffect(() => {
        activityEvents.map((eventName) => {
            window.addEventListener(eventName, markActive);
        });

        return (): void => {
            activityEvents.map((eventName) => {
                window.removeEventListener(eventName, markActive);
            });
        };
    }, [activityEvents]);
    React.useEffect(() => {
        if (inactivity === InactivityState.WasInactive) {
            console.log("User returning after inactivity, reloading.");
            window.location.reload();
        }
    }, [inactivity]);

    function resetupInactivityTimer(): void {
        if (timerHandle.current !== null) {
            clearInterval(timerHandle.current);
        }
        timerHandle.current = setTimeout(() => {
            console.log(`User is inactive at ${new Date(Date.now())}`);
            setInactivity(InactivityState.CurrentlyInactive);
        }, props.thresholdMillis);
    }

    function markActive(): void {
        setInactivity((old) => {
            switch (old) {
                case InactivityState.NeverInactive:
                    return InactivityState.NeverInactive;
                case InactivityState.CurrentlyInactive:
                case InactivityState.WasInactive:
                    return InactivityState.WasInactive;
                default:
                    throw new Error(`Unexpected value: ${old}`);
            }
        });
        resetupInactivityTimer();
    }

    return <></>;
}