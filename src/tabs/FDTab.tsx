import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Person } from '../interfaces/Person';
import type { FD } from '../interfaces/FD';
import { FDContainer, FDDetailContainer } from '../containers';
import AddFDModal from '../components/fd/AddFDModal';
import { FloatingActionButton, AddPersonModal } from '../components/core';
import {
  fetchFDPersons,
  addFDPerson,
  deleteFDPerson,
  fetchFDs,
  addFD,
  editFD,
  closeFD,
} from '../api';

const FDTab: React.FC<{
  detail: boolean;
}> = ({detail = false}) => {
  const [fdPeople, setFDPeople] = useState<Person[]>([]);
  const [fds, setFDs] = useState<FD[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const [editingFD, setEditingFD] = useState<FD | null>(null);
  const [isFDFormOpen, setIsFDFormOpen] = useState(false);
  const [fdForm, setFdForm] = useState({
    personId: '' as number | '',
    fdName: '',
    holderName: '',
    nomineeName: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    interestRate: '',
    tenureMonths: '',
    tenureType: 'months' as 'years' | 'months' | 'days',
    referenceNo: '',
    bank: '',
    tentativeEndDate: '',
  });

  const navigate = useNavigate();
  const params = useParams<{ personId?: string }>();

  // Load FD specific data
  useEffect(() => {
    fetchFDPersons().then((lPerson) => {
      if (lPerson) setFDPeople(lPerson);
    });
  }, []);

  useEffect(() => {
    fetchFDs().then((lFDs) => {
      if (lFDs) setFDs(lFDs);
    });
  }, []);

  // Sync selected person with route param and keep reference up to date
  useEffect(() => {
    const idStr = params.personId;
    if (!idStr) {
      setSelectedPerson(null);
      return;
    }
    const id = Number(idStr);
    setSelectedPerson(fdPeople.find((p) => p.id === id) || null);
  }, [fdPeople, params.personId]);

  const resetFdForm = () => {
    setFdForm({
      personId: '' as number | '',
      fdName: '',
      holderName: '',
      nomineeName: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0],
      interestRate: '',
      tenureMonths: '',
      tenureType: 'months',
      referenceNo: '',
      bank: '',
      tentativeEndDate: '',
    });
  };

  const openAddFD = () => {
    setEditingFD(null);
    resetFdForm();
    if (selectedPerson) {
      setFdForm((prev) => ({ ...prev, personId: selectedPerson.id, holderName: selectedPerson.name }));
    }
    setIsFDFormOpen(true);
  };

  const openEditFD = (fd: FD) => {
    setEditingFD(fd);
    setFdForm({
      personId: fd.personId,
      fdName: fd.fdName,
      holderName: fd.holderName,
      nomineeName: fd.nomineeName,
      amount: String(fd.amount),
      startDate: fd.startDate,
      interestRate: String(fd.interestRate),
      tenureMonths: String(fd.tenureMonths),
      tenureType: 'months',
      referenceNo: fd.referenceNo,
      bank: fd.bank,
      tentativeEndDate: fd.tentativeEndDate,
    });
    setIsFDFormOpen(true);
  };

  const handleSaveFD = () => {
    const pid = fdForm.personId === '' ? null : Number(fdForm.personId);
    const amt = parseFloat(fdForm.amount || '0');
    const rate = parseFloat(fdForm.interestRate || '0');
    const tRaw = parseInt(fdForm.tenureMonths || '0', 10);
    const months = fdForm.tenureType === 'years' ? tRaw * 12 : fdForm.tenureType === 'days' ? Math.ceil(tRaw / 30) : tRaw;
    if (!pid || !fdForm.startDate || !(amt > 0) || !(rate > 0) || !(months > 0)) {
      alert('Please fill Person, Amount, Start Date, Interest Rate and Tenure.');
      return;
    }
    const endDate = fdForm.tentativeEndDate || fdForm.startDate; // FDFormPage computes and sets tentativeEndDate
    const payload = {
      personId: pid,
      fdName: fdForm.fdName,
      holderName: fdForm.holderName,
      nomineeName: fdForm.nomineeName,
      amount: amt,
      startDate: fdForm.startDate,
      interestRate: rate,
      tenureMonths: months,
      referenceNo: fdForm.referenceNo,
      bank: fdForm.bank,
      tentativeEndDate: endDate,
      isActive: editingFD ? editingFD.isActive : true,
    };

    const isEdit = !!editingFD;

    const action = editingFD ? editFD({ ...payload, id: editingFD.id }) : addFD(payload);

    action
      .then(() => {
        fetchFDs().then((lFDs) => {
          if (lFDs) setFDs(lFDs);
        });
        setIsFDFormOpen(false);
        setEditingFD(null);
        resetFdForm();
      })
      .finally(() => {
        if (isEdit) {
          if (selectedPerson) {
            navigate(`/fd/${selectedPerson.id}`);
          } else {
            navigate('/fd');
          }
        }
      });
  };

  const handleCloseFD = (fdId: number) => {
    const confirmClose = window.confirm('Are you sure you want to close this FD?');
    if (!confirmClose) return;
    closeFD(fdId).then(() => {
      fetchFDs()
        .then((lFDs) => {
          if (lFDs) setFDs(lFDs);
        })
        .finally(() => {
          if (selectedPerson) {
            navigate(`/fd/${selectedPerson.id}`);
          } else {
            navigate('/fd');
          }
        });
    });
  };

  const handleAddFDPerson = () => {
    if (newPersonName.trim()) {
      const payload = {
        name: newPersonName.trim(),
        balance: 0,
      };
      addFDPerson(payload).then(() => {
        fetchFDPersons().then((lPerson) => {
          if (lPerson) setFDPeople(lPerson);
        });
        setNewPersonName('');
        setIsAddPersonModalOpen(false);
      });
    }
  };

  const handleDeleteFDPerson = (personId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (!confirmDelete) return;
    deleteFDPerson(personId).then(() => {
      fetchFDPersons().then((lPerson) => {
        if (lPerson) setFDPeople(lPerson);
      });
      if (selectedPerson?.id === personId) {
        setSelectedPerson(null);
        navigate('/fd');
      }
    });
  };

  return (
    <>
     {!detail && <div className="container mx-auto px-4 pt-4">
        <FDContainer
            people={fdPeople}
            fds={fds}
            onPersonClick={(p) => { setSelectedPerson(p); navigate(`/fd/${p.id}`); }}
            onDeletePerson={handleDeleteFDPerson}
          />
      </div>}

      {selectedPerson && (
        <div className="container mx-auto px-4 pt-4">
          <FDDetailContainer
            person={selectedPerson}
            fds={fds.filter((fd) => fd.personId === selectedPerson.id)}
            onEditFD={openEditFD}
            onCloseFD={handleCloseFD}
          />
        </div>
      )}

      <AddFDModal
            isOpen={isFDFormOpen}
            title={editingFD ? 'Edit Fixed Deposit' : 'Add Fixed Deposit'}
            people={fdPeople}
            personId={fdForm.personId}
            fdName={fdForm.fdName}
            holderName={fdForm.holderName}
            nomineeName={fdForm.nomineeName}
            amount={fdForm.amount}
            startDate={fdForm.startDate}
            interestRate={fdForm.interestRate}
            tenureMonths={fdForm.tenureMonths}
            tenureType={fdForm.tenureType}
            referenceNo={fdForm.referenceNo}
            bank={fdForm.bank}
            tentativeEndDate={fdForm.tentativeEndDate}
            setPersonId={(v) => setFdForm((prev) => ({ ...prev, personId: v }))}
            setFdName={(v) => setFdForm((prev) => ({ ...prev, fdName: v }))}
            setHolderName={(v) => setFdForm((prev) => ({ ...prev, holderName: v }))}
            setNomineeName={(v) => setFdForm((prev) => ({ ...prev, nomineeName: v }))}
            setAmount={(v) => setFdForm((prev) => ({ ...prev, amount: v }))}
            setStartDate={(v) => setFdForm((prev) => ({ ...prev, startDate: v }))}
            setInterestRate={(v) => setFdForm((prev) => ({ ...prev, interestRate: v }))}
            setTenureMonths={(v) => setFdForm((prev) => ({ ...prev, tenureMonths: v }))}
            setTenureType={(v) => setFdForm((prev) => ({ ...prev, tenureType: v }))}
            setReferenceNo={(v) => setFdForm((prev) => ({ ...prev, referenceNo: v }))}
            setBank={(v) => setFdForm((prev) => ({ ...prev, bank: v }))}
            setTentativeEndDate={(v) => setFdForm((prev) => ({ ...prev, tentativeEndDate: v }))}
            onCancel={() => {
              setIsFDFormOpen(false);
              setEditingFD(null);
            }}
            onSave={handleSaveFD}
          />

      <FloatingActionButton
          onClick={() => {
            if (selectedPerson) {
              openAddFD();
            } else {
              setIsAddPersonModalOpen(true);
            }
          }}
        />

      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        name={newPersonName}
        onChangeName={setNewPersonName}
        onCancel={() => setIsAddPersonModalOpen(false)}
        onAdd={handleAddFDPerson}
      />
    </>
  );
};

export default FDTab;
