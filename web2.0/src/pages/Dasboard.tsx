import { useState } from 'react';
import ApexCharts from 'react-apexcharts';
// import { DateTimePicke } from '../components/DateTimePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { RefreshCcw } from 'lucide-react';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { PickerDateTime } from '../components/PickerDateTime';

export function Dasboard() {
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);

  // Função que será passada para o componente filho
  const handleDateChangeStart = (date: any) => {
    setstartDate(date);
    console.log("Data selecionada: ", date.$d);
  };
  const handleDateChangeEnd = (date: any) => {
    setendDate(date);
    console.log("Data selecionada: ", date.$d);
  };


  const [ticketsAndTimes, setTicketsAndTimes] = useState({
    qtd_total_atendimentos: null,
    qtd_demanda_ativa: null,
    qtd_demanda_receptiva: null,
    tma: null,
    tme: null
  });
  const [ticketsChannelsOptions, setTicketsChannelsOptions] = useState<any>({
    series: [],
    labels: [],
    title: {
      text: 'Atendimento por canal'
    }
  });
  const [ticketsQueueOptions, setTicketsQueueOptions] = useState<any>({
    series: [],
    labels: [],
    title: {
      text: 'Atendimento por fila'
    }
  });
  const [ticketsEvolutionChannelsOptions, setTicketsEvolutionChannelsOptions] = useState<any>({
    series: [],
    labels: [],
    title: {
      text: 'Evolução por canal'
    }
  });
  const [ticketsEvolutionByPeriodOptions, setTicketsEvolutionByPeriodOptions] = useState<any>({
    series: [],
    labels: [],
    title: {
      text: 'Evolução atendimentos'
    }
  });
  const [ticketsPerUsersDetail, setTicketsPerUsersDetail] = useState<any[]>([]);

  return (
    <div>
      <div className=" flex justify-between items-center p-1">
        <div className="w-full flex justify-end mr-2 gap-4 items-center">
          <PickerDateTime onDateChange={handleDateChangeStart} label='Data inicio' />
          <PickerDateTime onDateChange={handleDateChangeEnd} label='Data fim' />
          <div className="flex flex-col w-full md:w-auto">
            <FormControl sx={{ minWidth: 60 }}>
              <InputLabel id="demo-simple-select-helper-label">Fila</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value=''
                label="fila"
              // onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Seleciona uma fila</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button className='flex gap-2 items-center bg-blue-500 text-white p-2 hover:bg-blue-600 rounded  w-auto md:w-auto'>
            <RefreshCcw size="20" />
            Atualiar
          </button>
        </div>
      </div>
      <div className="p-1 my-2">
        <div className="p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {['Total Atendimentos', 'Ativo', 'Receptivo', 'Novos Contatos'].map((title, index) => (
              <div key={index} className="bg-white border rounded p-4 text-center">
                <div className="text-2xl font-bold">2</div>
                <div>{title}</div>
              </div>
            ))}
            <div className="bg-white border rounded p-4 text-center">
              <div className="text-xl font-bold">1</div>
              Tempo Médio Atendimento (TMA)
            </div>
            <div className="bg-white border rounded p-4 text-center">
              <div className="text-xl font-bold">1</div>
              Tempo Médio 1º Resposta
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 rounded-lg p-2">
        <div className='flex justify-between gap-3'>
          <div className='w-[50%] border border-zinc-400 rounded-lg border-opacity-45'>
            <ApexCharts
              type="donut"
              height={300}
              options={ticketsChannelsOptions}
              series={ticketsChannelsOptions.series}
            />
          </div>
          <div className='w-[50%] border border-zinc-400 rounded-lg border-opacity-45'>
            <ApexCharts
              type="donut"
              height={300}
              options={ticketsQueueOptions}
              series={ticketsQueueOptions.series}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-2 bg-white rounded-lg">
        <div>
          <ApexCharts
            type="bar"
            height={300}
            options={ticketsEvolutionChannelsOptions}
            series={ticketsEvolutionChannelsOptions.series}
          />
        </div>
        <div>
          <ApexCharts
            type="line"
            height={300}
            options={ticketsEvolutionByPeriodOptions}
            series={ticketsEvolutionByPeriodOptions.series}
          />
        </div>
      </div>
      <div className="my-4 w-auto">
        <h3 className="text-lg font-semibold">Detalhes por Usuário</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">E-mail</th>
              <th className="p-2 text-left">Pendentes</th>
              <th className="p-2 text-left">Em Atendimento</th>
              <th className="p-2 text-left">Resolvidos</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">TME</th>
              <th className="p-2 text-left">TMA</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ticketsPerUsersDetail.map((user) => (
              <tr key={user.email}>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.qtd_pendentes}</td>
                <td className="p-2">{user.qtd_em_atendimento}</td>
                <td className="p-2">{user.qtd_resolvidos}</td>
                <td className="p-2">{user.qtd_por_usuario}</td>
                <td className="p-2">{user.tme ? 'formatDuration({ minutes: Math.floor(user.tme / 60), seconds: user.tme % 60 })' : 'N/A'}</td>
                <td className="p-2">{user.tma ? ' formatDuration({ minutes: Math.floor(user.tma / 60), seconds: user.tma % 60 })' : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
