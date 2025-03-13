import {
  Box,
  Flex,
  Text,
  Input,
  NativeSelect,
  Button,
  Table,
  Icon,
  Mark,
} from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";

import ReservedDialog from "./reserved-dialog";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";

interface Product {
  sku: string;
  instanceType: string;
  databaseEngine: string;
  memory: string;
  vcpu: string;
  location: string;
  terms: {
    OnDemand: { USD: string };
    Reserved: {
      [key: string]: {
        "No Upfront": string;
        "Partial Upfront": string;
        "All Upfront": string;
      };
    };
  };
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const columnHelper = createColumnHelper<Product>();

  const getUniqueValues = (data: Product[], key: keyof Product) => {
    return Array.from(new Set(data.map((item) => item[key])));
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("instanceType", {
        header: "Instance Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("databaseEngine", {
        header: "Database Engine",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("memory", {
        header: "Memory",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("vcpu", {
        header: "vCPU",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.terms.OnDemand.USD, {
        id: "onDemandPrice",
        header: "OnDemand Price",
        cell: (info) => `${info.getValue()}/hr`,
      }),
      columnHelper.display({
        id: "reservedPrice",
        header: "Reserved Price",
        cell: (info) => <ReservedDialog product={info.row.original} instance={info.row.original.instanceType} />,
      }),
    ],
    [products]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: (updater) => setColumnFilters(updater as any),
    onPaginationChange: (setPagination) => {
      const newPagination = typeof setPagination === 'function' ? setPagination({
        pageSize,
        pageIndex,
      }): setPagination;
      setPageSize(newPagination.pageSize);
      setPageIndex(newPagination.pageIndex);
    },
  });

  return (
    <Box px={10}>
      <Flex
        w="100"
        mb={4}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Flex gap={4} flex={1}>
          <InputGroup
            startElement={
              <Icon size="md">
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-search"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </Icon>
            }
          >
            <Input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              color="white"
              borderColor="white"
              rounded="md"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>

          <NativeSelect.Root key={1} size="md" w="200px">
            <NativeSelect.Field
              color="white"
              borderColor="var(--segundo)"
              bg="var(--segundo)"
              rounded="md"
              _hover={{ borderColor: "var(--primero)" }}
              value={
                (table
                  .getColumn("databaseEngine")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table
                  .getColumn("databaseEngine")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">All Engines</option>
              {getUniqueValues(products, "databaseEngine").map((value) => (
                <option key={value.toString()} value={value.toString()}>
                  {value.toString()}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root key={2} size="md" w="200px">
            <NativeSelect.Field
              color="white"
              borderColor="var(--segundo)"
              bg="var(--segundo)"
              rounded="md"
              _hover={{ borderColor: "var(--primero)" }}
              value={
                (table.getColumn("memory")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table
                  .getColumn("memory")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">All Memory</option>
              {getUniqueValues(products, "memory").map((value) => (
                <option key={value.toString()} value={value.toString()}>
                  {value.toString()}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root key={3} size="md" w="200px">
            <NativeSelect.Field
              color="white"
              borderColor="var(--segundo)"
              bg="var(--segundo)"
              rounded="md"
              _hover={{ borderColor: "var(--primero)" }}
              value={
                (table.getColumn("vcpu")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table
                  .getColumn("vcpu")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">All vCPU</option>
              {getUniqueValues(products, "vcpu").map((value) => (
                <option key={value.toString()} value={value.toString()}>
                  {value.toString()}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Flex>

      <Box rounded="md" shadow="md" bg="var(--segundo)" overflowX="auto">
        <Table.Root variant="outline" w="100%">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader
                    key={header.id}
                    style={{
                      background: "var(--segundo)",
                      color: "white",
                      padding: "12px",
                      textAlign:
                        header.column.id === "onDemandPrice" ||
                        header.column.id === "reservedPrice"
                          ? "center"
                          : "left",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} style={{ background: "var(--segundo)" }}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    style={{
                      color: "white",
                      padding: "12px",
                      textAlign:
                        cell.column.id === "onDemandPrice" ||
                        cell.column.id === "reservedPrice"
                          ? "center"
                          : "left",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex
        justify="space-between"
        align="center"
        mt="3"
        color="white"
        direction={{ base: "column", md: "row" }}
      >
        <Flex gap="1" align="center" direction={{ base: "column", md: "row" }}>
          <Flex gap="1" align="center">
            <Text>It shows</Text>

            <NativeSelect.Root w="70px" size="sm">
              <NativeSelect.Field
                value={pageSize.toString()}
                onChange={(e) => setPageSize(Number(e.target.value))}
                borderColor="var(--primero)"
                _hover={{ borderColor: "var(--primero)" }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Text>entries per page</Text>
          </Flex>
          <Text>
            out of a total of{" "}
            <Mark fontWeight="bold">
              {table.getFilteredRowModel().rows.length}
            </Mark>{" "}
            records.
          </Text>
        </Flex>

        <Flex gap={1} align="center" mt={{ base: "2", md: "0" }}>
          <Button
            size="sm"
            color="white"
            border="none"
            bg="var(--segundo)"
            px="2"
            rounded="md"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-chevrons-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M11 7l-5 5l5 5" />
              <path d="M17 7l-5 5l5 5" />
            </svg>{" "}
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => {
            const pageNumber = i + 1;
            const currentPage = table.getState().pagination.pageIndex + 1;
            const maxButtons = 2;
            const halfMaxButtons = Math.floor(maxButtons / 2);

            if (
              table.getPageCount() <= maxButtons ||
              pageNumber === 1 ||
              pageNumber === table.getPageCount() ||
              (pageNumber >= currentPage - halfMaxButtons &&
                pageNumber <= currentPage + halfMaxButtons)
            ) {
              return (
                <Button
                  size="sm"
                  color="white"
                  border="none"
                  px="3"
                  rounded="md"
                  _hover={{ backgroundColor: "var(--primero)" }}
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  style={{
                    background:
                      currentPage === pageNumber
                        ? "var(--primero)"
                        : "var(--segundo)",
                    color:
                      currentPage === pageNumber ? "var(--segundo)" : "white",
                  }}
                >
                  {pageNumber}
                </Button>
              );
            } else if (
              pageNumber === currentPage - halfMaxButtons - 1 ||
              pageNumber === currentPage + halfMaxButtons + 1
            ) {
              return (
                <Text key={i} style={{ color: "white", margin: "0 4px" }}>
                  ...
                </Text>
              );
            }
            return null;
          })}
          <Button
            size="sm"
            color="white"
            border="none"
            bg="var(--segundo)"
            px="2"
            rounded="md"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next{" "}
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-chevrons-right"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 7l5 5l-5 5" />
              <path d="M13 7l5 5l-5 5" />
            </svg>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
