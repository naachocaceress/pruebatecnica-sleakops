import { Flex, Image, Text, Box, Link } from "@chakra-ui/react";
import Logo from "/logo-sleakops.webp";

function Navbar() {
  return (
    <Box px={10}>
      <Flex
        color="white"
        py={5}
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        <Link href="/" border="none" title="Recarga de página">
          <Image src={Logo} w="150px" />
        </Link>
        <Text>Amazon RDS Pricing</Text>
      </Flex>
    </Box>
  );
}
export default Navbar;
