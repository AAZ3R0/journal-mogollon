import Logo from '../../img/LogoFigura.png'; // 1. Importa la imagen

export default function ApplicationLogo(props) {
    return (
        // 2. Usa la variable importada en el 'src'
        <img {...props} src={Logo} alt="Logo de la aplicación" />
    );
}