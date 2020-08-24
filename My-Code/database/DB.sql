use hoteldb;

create table mat_khau(
	id int auto_increment,
    PRIMARY KEY (id),
    hash_mat_khau varchar(200),
    cap_bac int
);

create table loai_khach(
	id int auto_increment,
    PRIMARY KEY (id),
    ten nvarchar(50),
    he_so double
);

create table khach_hang(
	cmnd int,
    PRIMARY KEY (cmnd),
    ho_ten nvarchar(50),
    loai int,
    foreign key (loai) REFERENCES loai_khach(id),
    dia_chi nvarchar(200)
);

create table loai_phong(
	id int auto_increment,
    PRIMARY KEY (id),
    ten nvarchar(20),
    don_gia int,
    so_khach_toi_da int,
    ty_le_phu_thu double
);

create table phong(
	id int auto_increment,
    PRIMARY KEY (id),
    ten nvarchar(50),
    tinh_trang tinyint,
    ghi_chu nvarchar(50),
	loai_phong int,
    foreign key (loai_phong) REFERENCES loai_phong(id)
);

create table phieu_thue_phong(
	id int auto_increment,
    PRIMARY KEY (id),
    ngay_bat_dau date,
    phong int,
    foreign key (phong) REFERENCES phong(id)
);

create table hoa_don(
	id int auto_increment,
    PRIMARY KEY (id),
    tri_gia double,
    phieu_thue int,
    foreign key (phieu_thue) REFERENCES phieu_thue_phong(id)
);

create table khach_hang_phieu_thue_phong(
	khach_hang int,
    foreign key (khach_hang) REFERENCES khach_hang(cmnd),
    phieu_thue int,
    foreign key (phieu_thue) REFERENCES phieu_thue_phong(id),
    PRIMARY KEY (khach_hang,phieu_thue)
);