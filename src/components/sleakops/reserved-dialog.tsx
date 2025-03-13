import {
  Flex,
  CloseButton,
  Icon,
  Text,
  Table,
  Dialog,
  Portal,
  Link,
  Mark,
} from "@chakra-ui/react";

interface Product {
  terms: {
    Reserved: {
      [key: string]: {
        "No Upfront": string;
        "Partial Upfront": string;
        "All Upfront": string;
      };
    };
  };
}

interface ReservedDialogProps {
  product: Product;
  instance: string;
}

function ReservedDialog({ product, instance }: ReservedDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Link variant="plain" color="var(--primero)">
          <Flex align="center">
            <Text textStyle="sm">See prices </Text>
            <Icon size="sm">
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
                className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l14 0" />
                <path d="M15 16l4 -4" />
                <path d="M15 8l4 4" />
              </svg>
            </Icon>
          </Flex>
        </Link>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="10px">
          <Dialog.Content bg="var(--quinto)" color="white">
            <Dialog.Header textStyle="md">
              <Flex align="end" gap="1">
                <Icon p="1" size="xl" color="var(--primero)">
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
                    className="icon icon-tabler icons-tabler-outline icon-tabler-server"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                    <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                    <path d="M7 8l0 .01" />
                    <path d="M7 16l0 .01" />
                  </svg>
                </Icon>
                <Text>Reserved Price <Mark color="grey">({instance})</Mark> </Text>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              {product && (
                <Table.Root variant="line">
                  <Table.Header>
                    <Table.Row bg="var(--quinto)">
                      <Table.ColumnHeader fontWeight="bold" color="white">
                      Duration
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" color="white">
                        No Upfront
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" color="white">
                        Partial Upfront
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" color="white">
                        All Upfront
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Object.entries(product.terms.Reserved).length > 0 ? (
                      Object.entries(product.terms.Reserved).map(
                        ([years, prices]) => (
                          <Table.Row key={years} bg="var(--quinto)">
                            <Table.Cell>{years}</Table.Cell>
                            <Table.Cell color="white" textAlign="center">
                              {prices["No Upfront"]
                                ? `$${prices["No Upfront"]}`
                                : "-"}
                            </Table.Cell>
                            <Table.Cell color="white" textAlign="center">
                              {prices["Partial Upfront"]
                                ? `$${prices["Partial Upfront"]}`
                                : "-"}
                            </Table.Cell>
                            <Table.Cell color="white" textAlign="center">
                              {prices["All Upfront"]
                                ? `$${prices["All Upfront"]}`
                                : "-"}
                            </Table.Cell>
                          </Table.Row>
                        )
                      )
                    ) : (
                      <Table.Row bg="var(--quinto)">
                        <Table.Cell colSpan={4} textAlign="center">
                        No Reserved prices found.
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  color="white"
                  size="sm"
                  _hover={{ backgroundColor: "var(--segundo)" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
export default ReservedDialog;
