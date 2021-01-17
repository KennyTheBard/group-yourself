
export type AlertType = 'error' | 'success' | 'warning';

export interface IAlert {
    message: string;
    type: AlertType;
}

export function Alert(alert: IAlert) {
    let classes = `alert ${alert.type}`;

    return (
        <div className={classes}>
            <p>{alert.message}</p>
        </div>
    )
}
