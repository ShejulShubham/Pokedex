

export default function Header(props) {
    const { handleToggleMenu } = props;

    return (
        <header>
            <button onClick={() => { handleToggleMenu() }} className="open-nav-button">
                <div style={{display: "flex"}}>
                    <div style={{padding: "6px"}}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <div>
                        <h1 className="text-gradient">Pokédex</h1>
                    </div>
                </div>
            </button>
        </header>
    )
}