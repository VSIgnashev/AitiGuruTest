import {
  Button,
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Table,
  message,
  type CheckboxChangeEvent,
} from "antd";
import React, { useEffect, useState } from "react";
import api from "../api.ts";
import FormattedNumber from "./formattedNumber.tsx";

function MainTable() {
  const [messageApi, contextHolder] = message.useMessage();

  interface Product {
    id: number;
    key: number;
    title: string;
    category: string;
    brand: string;
    sku: string;
    rating: number;
    price: number;
  }

  interface Items {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }

  interface FieldType {
    title: string;
    vendor: string;
    sku: string;
    price: number;
  }

  const [items, setItems] = useState<Items | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  function trimAndSetData(data: Items) {
    const newProducts: Product[] = data.products.map((item: Product) => {
      return {
        id: item.id,
        title: item.title,
        brand: item.brand ? item.brand : "unknown",
        sku: item.sku,
        rating: item.rating,
        price: item.price,
        key: item.id,
        category: item.category,
      };
    });
    const newData: Items = {
      products: newProducts,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };

    setItems(newData);
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get<Items>("/products");
        console.log(res);
        trimAndSetData(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchItems().then(() => {
      setIsLoading(false);
    });
  }, []);

  function AddButton() {
    return (
      <Button
        variant={"filled"}
        className={"w-[52px]! h-[26px]! rounded-[23px]! bg-[#242EDB]!"}
      >
        <img alt={"plus icon"} src={"/public/plusIcon.svg"} />
      </Button>
    );
  }

  function MoreButton() {
    return (
      <Button
        className={
          "rounded-full! border-none! size-[26px]! p-0! border-[#B2B3B9] flex! justify-center! items-center!"
        }
      >
        <img
          alt={"more icon"}
          className={"size-[26px]"}
          src={"/public/moreIcon.svg"}
        />
      </Button>
    );
  }

  function createItem(values: FieldType) {
    setItems((prev) => {
      if (!prev) {
        return prev;
      }
      const newItem = {
        id: prev.total + 1,
        title: values.title,
        brand: values.vendor,
        sku: values.sku,
        rating: 0,
        price: values.price,
        key: prev.total + 1,
        category: "Unknown",
      };
      return {
        ...prev,
        products: [...prev.products, newItem],
        total: prev.total + 1,
      };
    });

    setIsAddingNewItem(false);
    messageApi.success("Позиция успешно добавленна");
  }

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const res = await api.get<Items>("/products/search?q=" + e.target.value);
      trimAndSetData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  function AddNewItemPopUp() {
    return (
      <div
        className={
          "absolute z-99 top-0 left-0 w-full h-screen flex justify-center items-center bg-gray-800/40"
        }
        onClick={() => setIsAddingNewItem(false)}
      >
        <div
          className="p-[6px] rounded-[40px]  bg-white shadow-[0_24px_32px_0_rgba(0,0,0,0.04)] w-fit font-inter mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-linear-to-t p-[1px] from-[rgba(237,237,237,0)] to-[rgba(237,237,237,1)] rounded-[34px] overflow-hidden ">
            <div className="p-12 items-center flex flex-col gap-4 bg-white bg-linear-to-t from-white via-[rgba(35,35,35,0)] to-[rgba(35,35,35,0.03)]  rounded-[33px] ">
              <div className="flex flex-col gap-3">
                <h2
                  className={
                    "text-[#232323] font-semibold text-[40px] leading-[1.1] tracking-[-0.015em] "
                  }
                >
                  Добавить новую позицию
                </h2>
              </div>
              <div className="">
                <ConfigProvider
                  theme={{
                    components: {
                      Checkbox: {
                        lineWidth: 2,
                      },
                      Button: {
                        controlHeight: 54,
                      },
                    },
                    token: { fontFamily: "Inter", fontSize: 18 },
                  }}
                >
                  <Form
                    className={"w-[400px] mt-10! leading-[1.5]"}
                    layout={"vertical"}
                    onFinish={createItem}
                    requiredMark={false}
                  >
                    <Form.Item<FieldType>
                      style={{ marginBottom: "16px" }}
                      name={"title"}
                      rules={[
                        { required: true, message: "Введите наименование" },
                      ]}
                      label={"Наименование"}
                    >
                      <Input
                        allowClear={{
                          clearIcon: (
                            <div className={"w-4 h-4"}>
                              <img
                                src={"public/crossIcon.svg"}
                                alt={"cross icon"}
                              />
                            </div>
                          ),
                        }}
                        style={{ padding: "14px 16px" }}
                      />
                    </Form.Item>
                    <Form.Item<FieldType>
                      style={{ marginBottom: "20px" }}
                      label={"Вендор"}
                      name={"vendor"}
                      rules={[
                        { required: true, message: "Введите название вендора" },
                      ]}
                    >
                      <Input
                        style={{ padding: "14px 16px" }}
                        allowClear={{
                          clearIcon: (
                            <div className={"w-4 h-4"}>
                              <img
                                src={"public/crossIcon.svg"}
                                alt={"cross icon"}
                              />
                            </div>
                          ),
                        }}
                      />
                    </Form.Item>

                    <Form.Item<FieldType>
                      style={{ marginBottom: "20px" }}
                      label={"Артикул"}
                      name={"sku"}
                      rules={[{ required: true, message: "Введите артикул" }]}
                    >
                      <Input
                        style={{ padding: "14px 16px" }}
                        allowClear={{
                          clearIcon: (
                            <div className={"w-4 h-4"}>
                              <img
                                src={"public/crossIcon.svg"}
                                alt={"cross icon"}
                              />
                            </div>
                          ),
                        }}
                      />
                    </Form.Item>
                    <Form.Item<FieldType>
                      style={{ marginBottom: "20px" }}
                      label={"Цена" + ""}
                      name={"price"}
                      rules={[{ required: true, message: "Введите цену" }]}
                    >
                      <InputNumber
                        decimalSeparator={","}
                        style={{ padding: "14px 16px", width: "100%" }}
                      />
                    </Form.Item>

                    <div className={"mb-4 text-red-500"}>{}</div>
                    <Form.Item style={{ marginBottom: 16 }}>
                      <div className="w-[400px]">
                        <Button
                          htmlType={"submit"}
                          type={"primary"}
                          block
                          className={
                            " bg-[#242EDB]! mt-5 bg-gradient-to-t! from-[rgba(255,255,255,0]! to-[rgba(255,255,255,0.12)]! rounded-[12px]! border-1! border-[#367AFF]! hover:opacity-80 active:opacity-90"
                          }
                        >
                          Создать
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: "Наименование",
      dataIndex: "title",
      key: "title",
      width: 480,
      render: (title: string, record: Product) => {
        return (
          <div className={"w-[278px h-12 flex gap-[18px] items-center"}>
            <div className="size-12 rounded-lg border-1 border-[#ECECEB] bg-[#C4C4C4]"></div>
            <div className="flex flex-col gap-[10px]">
              <h5
                className={
                  "font-cairo font-bold text-[16px]  leading-none h-auto"
                }
              >
                {title}
              </h5>
              <p
                className={
                  "text-[#B2B3B9] font-cairo text-[14px] font-normal leading-none"
                }
              >
                {record.category}
              </p>
            </div>
          </div>
        );
      },
      sorter: (a: Product, b: Product) =>
        (a.title ?? "").localeCompare(b.title ?? ""),
    },
    {
      title: "Вендор",
      dataIndex: "brand",
      key: "brand",
      width: 125,
      render: (brand: string) => {
        return (
          <p className={"font-openSans font-bold text-[16px] leading-none"}>
            {brand}
          </p>
        );
      },
      sorter: (a: Product, b: Product) =>
        (a.brand ?? "").localeCompare(b.brand ?? ""),
    },

    {
      title: "Артикул",
      dataIndex: "sku",
      key: "sku",
      width: 380,
      align: "center" as const,
      render: (sku: string) => {
        return (
          <p className={"font-openSans font-normal text-[16px] leading-none"}>
            {sku}
          </p>
        );
      },
      sorter: (a: Product, b: Product) =>
        (a.sku ?? "").localeCompare(b.sku ?? ""),
    },
    {
      title: "Оценка",
      dataIndex: "rating",
      key: "rating",
      width: 170,
      align: "center" as const,
      render: (rating: number) => {
        return (
          <>
            {rating < 3 ? (
              <p
                className={"font-openSans font-normal text-[16px] leading-none"}
              >
                <span className={"text-[#F11010]"}>{rating}</span>/5
              </p>
            ) : (
              <p
                className={"font-openSans font-normal text-[16px] leading-none"}
              >
                {rating}/5
              </p>
            )}
          </>
        );
      },
      sorter: (a: Product, b: Product) => (a.rating ?? 0) - (b.rating ?? 0),
    },
    {
      title: "Цена, ₽",
      dataIndex: "price",
      key: "price",
      width: 350,
      align: "center" as const,
      render: (price: number) => <FormattedNumber value={price * 102} />,
      sorter: (a: Product, b: Product) => (a.price ?? 0) - (b.price ?? 0),
    },
    {
      title: "",
      dataIndex: "actionButtons",
      key: "actionButtons",
      align: "center" as const,
      width: 255,
      render: () => {
        return (
          <div className={"flex gap-8"}>
            <AddButton />
            <MoreButton />
          </div>
        );
      },
    },
  ];

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      if (items?.products) {
        setSelectedRowKeys(items?.products?.map((item) => item.key));
      }
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelect = (key: number, checked: boolean) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key),
    );
  };

  return (
    <>
      <section>
        <div className="mt-5 bg-white px-[30px] py-[26px] f-full flex justify-between">
          <h2 className={"font-cairo  font-bold text-[24px]"}>Товары</h2>

          <div className="w-[1023px] h-[48px]">
            <Input
              placeholder={"Найти"}
              onChange={handleSearch}
              styles={{ input: { fontFamily: "Inter" } }}
              prefix={
                <img
                  src={"public/magnifyingGlassLogo.svg"}
                  alt="icon of magnifyingGlass"
                />
              }
              className={`h-full bg-[#F3F3F3]! border-0!`}
            />
          </div>
          <div className="w-[91px]"></div>
        </div>
        <div className="w-full h-full mt-[13px] bg-white pt-11 px-[30px] pb-[37px]">
          <div className=" flex justify-between items-center">
            <h4
              className={
                "font-cairo font-bold text-[20px] leading-1 tracking-[0]"
              }
            >
              Все позиции
            </h4>
            <div className="flex gap-2">
              <Button
                type={"default"}
                className={
                  " p-0!  bg-white! border-1! border-[#ECECEB]! size-[42px]! flex items-center justify-center hover:shadow-sm"
                }
              >
                <div className="size-[22px] ">
                  <img src={"public/refreshIcon.svg"} alt="icon of refresh" />
                </div>
              </Button>
              <Button
                type={"default"}
                onClick={() => setIsAddingNewItem(true)}
                variant={"filled"}
                className={
                  "bg-[#242EDB]! px-5! h-[42px]! text-[#EBF3EA]! font-cairo! font-semibold! text-[14px]! flex gap-[15px]!"
                }
              >
                <img
                  src={"public/plusInCircleIcon.svg"}
                  className={"size-[22px]"}
                  alt="icon of plus"
                />
                Добавить
              </Button>
            </div>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Checkbox: {
                  colorPrimary: "rgb(60,83,142)",
                  colorWhite: "rgb(60,83,142)",
                  controlInteractiveSize: 22,
                  colorPrimaryHover: "rgb(60,83,142)",
                },
                Table: {
                  headerBg: "rgb(255,255,255)",
                  fontFamily: "Inter",
                  fontWeightStrong: 700,
                  fontSize: 16,
                  headerColor: "rgb(178,179,185)",
                  headerSplitColor: "rgb(255,255,255)",
                },
                Pagination: {
                  itemActiveBg: "rgb(121,127,234)",
                  itemActiveColor: "rgb(255,255,255)",
                  colorText: "rgb(178,179,185)",
                  itemActiveColorHover: "rgb(255,255,255)",
                },
              },
            }}
          >
            <Table
              rowSelection={{
                columnWidth: 58,
                columnTitle: (
                  <Checkbox className="no-tick" onChange={handleSelectAll} />
                ),
                renderCell: (_, record) => (
                  <Checkbox
                    className="no-tick"
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e) => handleSelect(record.id, e.target.checked)}
                  />
                ),
              }}
              loading={isLoading}
              className={"mt-10"}
              dataSource={items?.products}
              columns={columns}
              pagination={{
                defaultPageSize: 5,
                showTotal: (total, range) => (
                  <div className="absolute!  font-roboto left-0 font-normal text-[#969B9F]">
                    Показано{" "}
                    <span className=" text-[#333] font-normal">
                      {range[0]}-{range[1]}
                    </span>{" "}
                    из <span className="font-normal text-[#333]">{total}</span>
                  </div>
                ),
              }}
            />
          </ConfigProvider>
        </div>
      </section>
      {isAddingNewItem && <AddNewItemPopUp />}
      <>{contextHolder}</>
    </>
  );
}

export default MainTable;
