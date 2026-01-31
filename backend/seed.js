const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Cinema = require('./models/Cinema');
const Show = require('./models/Show');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected.');

        // 1. Clear existing data
        console.log('🗑️  Clearing old data...');
        await Movie.deleteMany({});
        await Cinema.deleteMany({});
        await Show.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Old data cleared.');

        // 2. Create Admin User
        console.log('👤 Creating Admin User...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin User created.');

        // 3. Create Movies (Rich Data)
        console.log('🎬 Seeding Movies...');
        const movies = await Movie.insertMany([
            {
                title: 'Fighter',
                slug: 'fighter',
                description: 'Top aviators of the IAF come together in the face of imminent danger, to form Air Dragons.',
                genre: ['Action', 'Thriller'],
                language: ['Hindi'],
                duration: 166,
                posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/fighter-et00304730-1706082402.jpg',
                bannerUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/fighter-et00304730-1706082402.jpg',
                heroImageUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/fighter-et00304730-1706082402.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
                rating: 8.4,
                certificate: 'UA',
                releaseDate: new Date('2024-01-25'),
                status: 'NOW_SHOWING',
                formats: ['2D', '3D', 'IMAX 3D', '4DX'],
                cast: [
                    { name: 'Hrithik Roshan', role: 'Patty', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/hrithik-roshan-716-17-06-2020-05-43-27.jpg' },
                    { name: 'Deepika Padukone', role: 'Minni', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/deepika-padukone-2822-12-09-2017-06-31-43.jpg' }
                ],
                crew: [
                    { name: 'Siddharth Anand', role: 'Director', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/siddharth-anand-335-24-03-2017-12-34-12.jpg' }
                ]
            },
            {
                title: 'Dune: Part Two',
                slug: 'dune-part-two',
                description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators.',
                genre: ['Sci-Fi', 'Adventure'],
                language: ['English', 'Hindi'],
                duration: 166,
                posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dune-part-two-et00331567-1708685415.jpg',
                bannerUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/dune-part-two-et00331567-1708685415.jpg',
                heroImageUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/dune-part-two-et00331567-1708685415.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=U2Qp5pL3ovA',
                rating: 9.1,
                certificate: 'UA',
                releaseDate: new Date('2024-03-01'),
                status: 'NOW_SHOWING',
                formats: ['2D', 'IMAX', '4DX'],
                cast: [
                    { name: 'Timothée Chalamet', role: 'Paul Atreides', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/timothee-chalamet-1088035-13-12-2017-04-58-18.jpg' },
                    { name: 'Zendaya', role: 'Chani', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/zendaya-1085028-15-09-2017-05-59-22.jpg' }
                ],
                crew: [
                    { name: 'Denis Villeneuve', role: 'Director', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/denis-villeneuve-1065113-24-03-2017-12-42-03.jpg' }
                ]
            },
            {
                title: 'Kung Fu Panda 4',
                slug: 'kung-fu-panda-4',
                description: 'Po must train a new Dragon Warrior while avoiding the sorceress Chameleon.',
                genre: ['Animation', 'Comedy'],
                language: ['English', 'Hindi'],
                duration: 94,
                posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kung-fu-panda-4-et00379741-1709623868.jpg',
                bannerUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kung-fu-panda-4-et00379741-1709623868.jpg',
                heroImageUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kung-fu-panda-4-et00379741-1709623868.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
                rating: 8.0,
                certificate: 'U',
                releaseDate: new Date('2024-03-15'),
                status: 'COMING_SOON',
                formats: ['2D', '3D'],
                cast: [
                    { name: 'Jack Black', role: 'Po (voice)', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/jack-black-855-24-03-2017-12-36-58.jpg' }
                ],
                crew: [
                    { name: 'Mike Mitchell', role: 'Director', imageUrl: '' }
                ]
            }
        ]);
        console.log(`✅ ${movies.length} Movies seeded.`);

        // 4. Create Cinemas
        console.log('🍿 Seeding Cinemas...');
        const cinemas = await Cinema.insertMany([
            {
                name: 'PVR: Cyber Hub',
                location: 'Cyber City, Gurgaon',
                screens: [
                    { screenNumber: 1, seatLayout: [] },
                    { screenNumber: 2, seatLayout: [] }
                ]
            },
            {
                name: 'Miraj Cinemas',
                location: 'City Mall, Mumbai',
                screens: [
                    { screenNumber: 1, seatLayout: [] }
                ]
            }
        ]);
        console.log(`✅ ${cinemas.length} Cinemas seeded.`);

        // 5. Create Shows
        console.log('📅 Seeding Shows...');
        const today = new Date();
        today.setHours(10, 0, 0, 0); // 10 AM

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const showData = [];

        // Add shows for "Now Showing" movies
        const nowShowingMovies = movies.filter(m => m.status === 'NOW_SHOWING');

        nowShowingMovies.forEach(movie => {
            cinemas.forEach(cinema => {
                // Show 1: Today 10:00 AM
                showData.push({
                    movie: movie._id,
                    cinema: cinema._id,
                    screenNumber: 1,
                    startTime: new Date(today),
                    seats: []
                });

                // Show 2: Today 02:00 PM
                const show2 = new Date(today);
                show2.setHours(14, 0, 0, 0);
                showData.push({
                    movie: movie._id,
                    cinema: cinema._id,
                    screenNumber: 1,
                    startTime: show2,
                    seats: []
                });

                // Show 3: Tomorrow 06:00 PM
                const show3 = new Date(tomorrow);
                show3.setHours(18, 0, 0, 0);
                showData.push({
                    movie: movie._id,
                    cinema: cinema._id,
                    screenNumber: 1,
                    startTime: show3,
                    seats: []
                });
            });
        });

        await Show.insertMany(showData);
        console.log(`✅ ${showData.length} Shows seeded.`);

        console.log('✨ Data Seeding Completed Successfully! Exiting...');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
};

seedData();
