import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "120px",
  width: "200px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/util/swagger_gen" style={{ height: '120px', textAlign: 'center' }}>
      <Image src="/images/logos/logo.png" alt="logo" height={100} width={180} style={{ marginTop: '8px', borderRadius: '12px' }} priority />
    </LinkStyled>
  );
};

export default Logo;