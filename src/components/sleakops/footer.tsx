import { Link, Text, Icon, Flex } from "@chakra-ui/react";

function Footer() {
  return (
    <Flex gap={2} mt="10" pb="2" w="100" justify="center" align="center">
      <Text color="white">Prueba técnica 2025</Text>
      <Icon size="md" color="white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-code"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 8l-4 4l4 4" />
          <path d="M17 8l4 4l-4 4" />
          <path d="M14 4l-4 16" />
        </svg>
      </Icon>

      <Link href="https://www.linkedin.com/in/nacho-caceres/" color="var(--primero)">
        Nacho Cáceres
      </Link>
    </Flex>
  );
}
export default Footer;
