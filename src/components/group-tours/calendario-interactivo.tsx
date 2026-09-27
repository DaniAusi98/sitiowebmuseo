/*import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

interface AvailableDay {
  dia: string; // "YYYY-MM-DD"
}

interface AvailableSlot {
  turnoId: number;
  horario: { fecha: string; inicio: string; fin: string };
  estadoTurno: string;
  capacidadMaxima: number;
  capacidadHabilitadaParaReserva: number;
}

interface InteractiveCalendarProps {
  onDateSelect: (dateYYYYMMDD: string) => void;
  onTimeSelect: (timeHHmm: string, turnoId: number) => void;
  selectedDate?: string;
  selectedTime?: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function formatTimeFromParts(fecha: string, timeHHmmss: string) {
  const dt = new Date(`${fecha}T${timeHHmmss}`);
  return dt.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function InteractiveCalendar({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
}: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableDays();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate) fetchAvailableSlots(selectedDate);
    else setAvailableSlots([]);
  }, [selectedDate]);

  const fetchAvailableDays = async () => {
    setLoading(true);
    try {
      const month = currentMonth.getMonth() + 1;
      const year = currentMonth.getFullYear();

      const res = await fetch(
        `https://localhost:7204/api/v1/Turnos?mes=${month}&anio=${year}`,
      );
      const data = await res.json();

      if (data?.success) setAvailableDays(data.data.items);
      else setAvailableDays([]);
    } catch (err) {
      console.error("Error fetching available days:", err);
      setAvailableDays([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (dateYYYYMMDD: string) => {
    setSlotsLoading(true);
    try {
      const res = await fetch(
        `https://localhost:7204/api/v1/Turnos/TurnosDisponibles?fecha=${encodeURIComponent(
          dateYYYYMMDD,
        )}`,
      );
      const data = await res.json();

      if (data?.success) setAvailableSlots(data.data.items);
      else setAvailableSlots([]);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));

    return days;
  };

  const isDateAvailable = (date: Date) => {
    const key = formatDate(date);
    return availableDays.some((ad) => ad.dia === key);
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return formatDate(date) === selectedDate;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    onDateSelect(formatDate(date));
  };

  const handleTimeClick = (slot: AvailableSlot) => {
    const hhmm = slot.horario.inicio.slice(0, 5);
    onTimeSelect(hhmm, slot.turnoId);
  };

  const previousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2" /> Seleccionar Fecha
          </h3>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="font-medium min-w-[140px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>

            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8 text-gray-500">
            Cargando días disponibles...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((d) => (
              <div
                key={d}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {d}
              </div>
            ))}

            {getDaysInMonth(currentMonth).map((date, idx) =>
              date ? (
                <div key={formatDate(date)} className="aspect-square">
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={!isDateAvailable(date)}
                    className={`w-full h-full p-1 text-sm rounded-md transition-colors ${
                      isDateSelected(date)
                        ? "bg-red-600 text-white"
                        : isDateAvailable(date)
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                </div>
              ) : (
                <div key={`empty-${idx}`} className="aspect-square" />
              ),
            )}
          </div>
        )}
*/
{
  /* leyenda 
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
            <span>Días disponibles</span>
          </div>

          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Día seleccionado</span>
          </div>
        </div>
      </Card>

      {selectedDate && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2" /> Horarios Disponibles
          </h3>

          {slotsLoading ? (
            <div className="flex justify-center py-4 text-gray-500">
              Cargando horarios...
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableSlots.map((slot) => {
                const isSelected =
                  selectedTime === slot.horario.inicio.slice(0, 5);

                return (
                  <button
                    type="button"
                    key={slot.turnoId}
                    onClick={() => handleTimeClick(slot)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      isSelected
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                    }`}
                  >
                    <div className="font-medium">
                      {formatTimeFromParts(
                        slot.horario.fecha,
                        slot.horario.inicio,
                      )}{" "}
                      -{" "}
                      {formatTimeFromParts(
                        slot.horario.fecha,
                        slot.horario.fin,
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      Capacidad: {slot.capacidadMaxima} personas
                    </div>

                    <div className="text-sm text-gray-600">
                      Capacidad Disponible:{" "}
                      {slot.capacidadHabilitadaParaReserva} personas
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay horarios disponibles para esta fecha
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
*/
}
