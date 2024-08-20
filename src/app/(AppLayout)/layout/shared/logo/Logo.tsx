import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "block",
  textAlign: "center",
}));

interface LogoProps {
  small?: boolean;
}

const Logo = ({ small = false }: LogoProps) => {
  return (
    <LinkStyled href="/util/json_viewer">
      <Image
        src="/dev-utils/images/logos/logo_dev_utils.png"
        alt="logo"
        height={small ? 30 : 100} // Ajusta la altura según el estado colapsado
        width={small ? 40 : 180}  // Ajusta el ancho según el estado colapsado
        style={{
          marginTop: '10px',
          borderRadius: '12px',
          transition: 'all 0.3s ease', // Añade transición para que el cambio sea suave
        }}
        priority
      />
    </LinkStyled>
  );
};

export default Logo;
