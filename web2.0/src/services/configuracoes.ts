import request from "./request";

export function ListarConfiguracoes(params: any) {
  return request({
    url: "/settings/",
    method: "get",
    params,
  });
}

export function AlterarConfiguracao(data: { Key: any }) {
  return request({
    url: `/settings/${data.Key}/`,
    method: "put",
    data,
  });
}
